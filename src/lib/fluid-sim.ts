/* ------------------------------------------------------------------
   Fluid smoke — a GPU fluid solver, ported to TypeScript from the
   WebGL fluid simulation that drives the "smoke" background on
   thevelocitydigital.co.

   The pointer injects dye into a curl-noise velocity field; the dye
   swirls, diffuses and fades. Colours cycle through the hue wheel, so
   dragging across the canvas paints a different colour every moment.
   The canvas stays transparent, so it composites over whatever section
   background it sits on rather than stamping its own black.

   Nothing here touches the DOM beyond the canvas it is handed. If the
   device cannot supply a usable WebGL context the factory returns null
   and the caller renders without the effect.
------------------------------------------------------------------- */

export type RGB = { r: number; g: number; b: number };

export type FluidSimOptions = {
  /** Grid size of the velocity/pressure field. Lower is cheaper. */
  simResolution?: number;
  /** Grid size of the dye field. Controls how crisp the smoke is. */
  dyeResolution?: number;
  /** Vorticity strength — how much the smoke curls in on itself. */
  curl?: number;
  /** Per-frame fade of the dye (1 = never fades). */
  densityDissipation?: number;
  /** Per-frame fade of the velocity field. */
  velocityDissipation?: number;
  /** Pressure diffusion. */
  pressure?: number;
  pressureIterations?: number;
  /** Gaussian splat radius in UV units. */
  splatRadius?: number;
  /** Pointer velocity multiplier — how hard the smoke gets thrown. */
  splatForce?: number;
  /** Brightness ceiling of the injected dye. */
  colorScale?: number;
  /** How far the hue advances each colour tick. */
  hueStep?: number;
  /** Seconds between colour ticks. */
  hueInterval?: number;
  /** Starting hue, 0..1. */
  hueStart?: number;
  /** Backing store cap, so 3x screens don't quadruple the fill cost. */
  maxDpr?: number;
};

export type FluidSim = {
  /** Inject dye at (x, y) in CSS pixels from the canvas' top-left. */
  splat(x: number, y: number, dx: number, dy: number, color?: RGB): void;
  /** Resize the backing store to match the element's CSS box. */
  resize(cssWidth: number, cssHeight: number): void;
  /** Advance the simulation and paint one frame. dt is in seconds. */
  frame(dt: number): void;
  /** The colour the next splat will use. */
  color(): RGB;
  /** Empty the canvas without tearing down the context. */
  clear(): void;
  dispose(): void;
};

const DEFAULTS: Required<FluidSimOptions> = {
  simResolution: 128,
  dyeResolution: 512,
  curl: 5,
  densityDissipation: 0.97,
  velocityDissipation: 0.98,
  pressure: 0.8,
  pressureIterations: 10,
  splatRadius: 0.006,
  splatForce: 5,
  colorScale: 0.15,
  hueStep: 0.12,
  hueInterval: 0.12,
  hueStart: Math.random(),
  maxDpr: 1.5,
};

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const VERTEX_SHADER = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

/* Scales a texture by a constant — used to bleed the pressure field. */
const COPY_SHADER = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}`;

/* Gaussian blob added to the velocity (xy) and dye (rgb) fields. */
const SPLAT_SHADER = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

/* Manual bilinear filtering, for devices that can't filter half-floats. */
const ADVECTION_SHADER = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
  gl_FragColor.a = 1.0;
}`;

/* Same, leaning on hardware filtering. */
const ADVECTION_LINEAR_SHADER = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = dissipation * texture2D(uSource, coord);
  gl_FragColor.a = 1.0;
}`;

const DIVERGENCE_SHADER = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL_SHADER = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY_SHADER = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(velocity + force * dt, 0.0, 1.0);
}`;

const PRESSURE_SHADER = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT_SHADER = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

/* Paints the dye, lit from the dye field's own slope so the smoke reads
   as volumetric rather than as a flat smear. */
const DISPLAY_SHADER = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec2 texelSize;
void main () {
  vec3 L = texture2D(uTexture, vL).rgb;
  vec3 R = texture2D(uTexture, vR).rgb;
  vec3 T = texture2D(uTexture, vT).rgb;
  vec3 B = texture2D(uTexture, vB).rgb;
  vec3 C = texture2D(uTexture, vUv).rgb;
  float dx = length(R) - length(L);
  float dy = length(T) - length(B);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  vec3 l = vec3(0.0, 0.0, 1.0);
  float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
  C *= diffuse;
  float a = max(C.r, max(C.g, C.b));
  gl_FragColor = vec4(C, a);
}`;

/* ------------------------------------------------------------------ */
/* GL plumbing                                                         */
/* ------------------------------------------------------------------ */

type Format = { internal: number; format: number };

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
};

type DoubleFBO = {
  read: FBO;
  write: FBO;
  swap(): void;
  texelSizeX: number;
  texelSizeY: number;
};

class Program {
  readonly program: WebGLProgram;
  readonly uniforms: Record<string, WebGLUniformLocation | null> = {};

  constructor(
    private readonly gl: WebGL2RenderingContext,
    vertex: WebGLShader,
    fragment: WebGLShader,
  ) {
    const program = gl.createProgram();
    if (!program) throw new Error("fluid-sim: could not create program");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`fluid-sim: link failed — ${log ?? "unknown"}`);
    }
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      this.uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    this.program = program;
  }

  bind() {
    this.gl.useProgram(this.program);
  }
}

/* ------------------------------------------------------------------ */
/* Factory                                                             */
/* ------------------------------------------------------------------ */

export function createFluidSim(
  canvas: HTMLCanvasElement,
  options: FluidSimOptions = {},
): FluidSim | null {
  const settings: Required<FluidSimOptions> = { ...DEFAULTS, ...options };

  const contextAttributes: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
  };

  /* WebGL2's surface is a superset of WebGL1's at the call level, so the
     context is typed as WebGL2 and the v2-only enums are gated behind
     `isWebGL2` below. */
  const gl = (canvas.getContext("webgl2", contextAttributes) ??
    canvas.getContext("webgl", contextAttributes) ??
    canvas.getContext("experimental-webgl", contextAttributes)) as
    | WebGL2RenderingContext
    | null;

  if (!gl || gl.isContextLost()) return null;

  const isWebGL2 =
    typeof WebGL2RenderingContext !== "undefined" &&
    gl instanceof WebGL2RenderingContext;

  const halfFloat = isWebGL2
    ? gl.HALF_FLOAT
    : (
        gl.getExtension("OES_texture_half_float") as {
          HALF_FLOAT_OES: number;
        } | null
      )?.HALF_FLOAT_OES;

  if (typeof halfFloat !== "number") return null;

  const supportLinearFiltering = Boolean(
    isWebGL2
      ? gl.getExtension("OES_texture_float_linear")
      : gl.getExtension("OES_texture_half_float_linear"),
  );

  if (isWebGL2) gl.getExtension("EXT_color_buffer_float");

  const rgbaFormat: Format = isWebGL2
    ? { internal: gl.RGBA16F, format: gl.RGBA }
    : { internal: gl.RGBA, format: gl.RGBA };
  const rgFormatPreferred: Format = isWebGL2
    ? { internal: gl.RG16F, format: gl.RG }
    : rgbaFormat;
  const rFormatPreferred: Format = isWebGL2
    ? { internal: gl.R16F, format: gl.RED }
    : rgbaFormat;

  /* --- shader compilation ------------------------------------------- */

  let vertexShader: WebGLShader;
  let programs: Record<string, Program>;
  try {
    vertexShader = (() => {
      const shader = gl.createShader(gl.VERTEX_SHADER);
      if (!shader) throw new Error("fluid-sim: could not create shader");
      gl.shaderSource(shader, VERTEX_SHADER);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
          `fluid-sim: vertex compile failed — ${gl.getShaderInfoLog(shader) ?? "unknown"}`,
        );
      }
      return shader;
    })();

    const build = (source: string): Program => {
      const shader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!shader) throw new Error("fluid-sim: could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
          `fluid-sim: fragment compile failed — ${gl.getShaderInfoLog(shader) ?? "unknown"}`,
        );
      }
      const program = new Program(gl, vertexShader, shader);
      gl.deleteShader(shader);
      return program;
    };

    programs = {
      copy: build(COPY_SHADER),
      splat: build(SPLAT_SHADER),
      advection: build(
        supportLinearFiltering ? ADVECTION_LINEAR_SHADER : ADVECTION_SHADER,
      ),
      divergence: build(DIVERGENCE_SHADER),
      curl: build(CURL_SHADER),
      vorticity: build(VORTICITY_SHADER),
      pressure: build(PRESSURE_SHADER),
      gradientSubtract: build(GRADIENT_SUBTRACT_SHADER),
      display: build(DISPLAY_SHADER),
    };
  } catch {
    return null;
  }

  /* --- full-screen quad --------------------------------------------- */

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (target: FBO | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  /* --- formats and textures ----------------------------------------- */

  const supportsFormat = (format: Format): boolean => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format.internal,
      4,
      4,
      0,
      format.format,
      halfFloat,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    const complete =
      gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(texture);
    return complete;
  };

  /* Walk back down the precision ladder instead of giving up outright. */
  const resolveFormat = (format: Format): Format | null => {
    if (supportsFormat(format)) return format;
    if (!isWebGL2) return null;
    if (format.internal === gl.R16F) return resolveFormat(rgFormatPreferred);
    if (format.internal === gl.RG16F) return resolveFormat(rgbaFormat);
    return null;
  };

  const colorFormat = resolveFormat(rgbaFormat);
  if (!colorFormat) return null;
  const vectorFormat = resolveFormat(rgFormatPreferred) ?? colorFormat;
  const scalarFormat = resolveFormat(rFormatPreferred) ?? colorFormat;

  const textureFilter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  const createFBO = (
    width: number,
    height: number,
    format: Format,
    filter: number,
  ): FBO => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format.internal,
      width,
      height,
      0,
      format.format,
      halfFloat,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture,
      fbo,
      width,
      height,
      texelSizeX: 1 / width,
      texelSizeY: 1 / height,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  };

  const createDoubleFBO = (
    width: number,
    height: number,
    format: Format,
    filter: number,
  ): DoubleFBO => {
    let first = createFBO(width, height, format, filter);
    let second = createFBO(width, height, format, filter);
    return {
      get read() {
        return first;
      },
      get write() {
        return second;
      },
      swap() {
        const temp = first;
        first = second;
        second = temp;
      },
      get texelSizeX() {
        return first.texelSizeX;
      },
      get texelSizeY() {
        return first.texelSizeY;
      },
    };
  };

  const resolutionOf = (resolution: number) => {
    const raw = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const aspect = raw < 1 ? 1 / raw : raw;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  };

  let simWidth = 2;
  let simHeight = 2;
  let dyeWidth = 2;
  let dyeHeight = 2;

  let velocity: DoubleFBO | null = null;
  let dye: DoubleFBO | null = null;
  let divergence: FBO | null = null;
  let curl: FBO | null = null;
  let pressure: DoubleFBO | null = null;

  const deleteFBO = (target: FBO | null) => {
    if (!target) return;
    gl.deleteTexture(target.texture);
    gl.deleteFramebuffer(target.fbo);
  };

  const deleteDoubleFBO = (target: DoubleFBO | null) => {
    if (!target) return;
    deleteFBO(target.read);
    deleteFBO(target.write);
  };

  const initFramebuffers = () => {
    const sim = resolutionOf(settings.simResolution);
    const dyeRes = resolutionOf(settings.dyeResolution);

    simWidth = sim.width;
    simHeight = sim.height;
    dyeWidth = dyeRes.width;
    dyeHeight = dyeRes.height;

    deleteDoubleFBO(velocity);
    deleteDoubleFBO(dye);
    deleteDoubleFBO(pressure);
    deleteFBO(divergence);
    deleteFBO(curl);

    velocity = createDoubleFBO(simWidth, simHeight, vectorFormat, textureFilter);
    dye = createDoubleFBO(dyeWidth, dyeHeight, colorFormat, textureFilter);
    divergence = createFBO(simWidth, simHeight, scalarFormat, gl.NEAREST);
    curl = createFBO(simWidth, simHeight, scalarFormat, gl.NEAREST);
    pressure = createDoubleFBO(simWidth, simHeight, scalarFormat, gl.NEAREST);
  };

  /* --- colour -------------------------------------------------------- */

  let hue = settings.hueStart - Math.floor(settings.hueStart);
  let hueClock = 0;

  /* Full-saturation, full-value HSV, exactly like the reference site's
     "colorful" mode: every tick lands somewhere else on the wheel. */
  const colorAt = (h: number, scale: number): RGB => {
    const sector = h * 6;
    const index = Math.floor(sector) % 6;
    const f = sector - Math.floor(sector);
    switch ((index + 6) % 6) {
      case 0:
        return { r: scale, g: f * scale, b: 0 };
      case 1:
        return { r: (1 - f) * scale, g: scale, b: 0 };
      case 2:
        return { r: 0, g: scale, b: f * scale };
      case 3:
        return { r: 0, g: (1 - f) * scale, b: scale };
      case 4:
        return { r: f * scale, g: 0, b: scale };
      default:
        return { r: scale, g: 0, b: (1 - f) * scale };
    }
  };

  /* --- simulation ---------------------------------------------------- */

  let cssWidth = 1;
  let cssHeight = 1;

  const splat = (x: number, y: number, dx: number, dy: number, color: RGB) => {
    if (!velocity || !dye) return;

    /* Callers work in CSS pixels from the top-left; the simulation works
       in UVs from the bottom-left. */
    const u = x / cssWidth;
    const v = 1 - y / cssHeight;
    const aspect = canvas.width / canvas.height;
    const ratio = canvas.width / cssWidth;

    programs.splat.bind();
    gl.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(programs.splat.uniforms.aspectRatio, aspect);
    gl.uniform2f(programs.splat.uniforms.point, u, v);
    gl.uniform3f(
      programs.splat.uniforms.color,
      dx * ratio * settings.splatForce,
      -dy * ratio * settings.splatForce,
      0,
    );
    gl.uniform1f(programs.splat.uniforms.radius, settings.splatRadius);
    gl.viewport(0, 0, simWidth, simHeight);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b);
    gl.viewport(0, 0, dyeWidth, dyeHeight);
    blit(dye.write);
    dye.swap();
  };

  const simulate = (dt: number) => {
    if (!velocity || !dye || !divergence || !curl || !pressure) return;

    gl.disable(gl.BLEND);

    programs.curl.bind();
    gl.uniform2f(
      programs.curl.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
    gl.viewport(0, 0, simWidth, simHeight);
    blit(curl);

    programs.vorticity.bind();
    gl.uniform2f(
      programs.vorticity.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.vorticity.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(programs.vorticity.uniforms.curl, settings.curl);
    gl.uniform1f(programs.vorticity.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    programs.divergence.bind();
    gl.uniform2f(
      programs.divergence.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    programs.copy.bind();
    gl.uniform1i(programs.copy.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(programs.copy.uniforms.value, settings.pressure);
    blit(pressure.write);
    pressure.swap();

    programs.pressure.bind();
    gl.uniform2f(
      programs.pressure.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < settings.pressureIterations; i++) {
      gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    programs.gradientSubtract.bind();
    gl.uniform2f(
      programs.gradientSubtract.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(
      programs.gradientSubtract.uniforms.uPressure,
      pressure.read.attach(0),
    );
    gl.uniform1i(
      programs.gradientSubtract.uniforms.uVelocity,
      velocity.read.attach(1),
    );
    blit(velocity.write);
    velocity.swap();

    programs.advection.bind();
    gl.uniform2f(
      programs.advection.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    if (!supportLinearFiltering) {
      gl.uniform2f(
        programs.advection.uniforms.dyeTexelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
    }
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocityId);
    gl.uniform1i(programs.advection.uniforms.uSource, velocityId);
    gl.uniform1f(programs.advection.uniforms.dt, dt);
    gl.uniform1f(
      programs.advection.uniforms.dissipation,
      settings.velocityDissipation,
    );
    blit(velocity.write);
    velocity.swap();

    if (!supportLinearFiltering) {
      gl.uniform2f(
        programs.advection.uniforms.dyeTexelSize,
        dye.texelSizeX,
        dye.texelSizeY,
      );
    }
    gl.viewport(0, 0, dyeWidth, dyeHeight);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(
      programs.advection.uniforms.dissipation,
      settings.densityDissipation,
    );
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    if (!dye) return;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    programs.display.bind();
    gl.uniform2f(
      programs.display.uniforms.texelSize,
      dye.texelSizeX,
      dye.texelSizeY,
    );
    gl.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0));
    blit(null);
  };

  /* --- public surface ------------------------------------------------ */

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    cssWidth = width;
    cssHeight = height;
    const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
    const pixelWidth = Math.max(2, Math.round(width * dpr));
    const pixelHeight = Math.max(2, Math.round(height * dpr));
    if (canvas.width === pixelWidth && canvas.height === pixelHeight && velocity) {
      return;
    }
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    initFramebuffers();
  };

  const clear = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const loseContext = () => {
    velocity = null;
    dye = null;
    pressure = null;
    divergence = null;
    curl = null;
  };

  canvas.addEventListener("webglcontextlost", loseContext);

  const dispose = () => {
    canvas.removeEventListener("webglcontextlost", loseContext);
    deleteDoubleFBO(velocity);
    deleteDoubleFBO(dye);
    deleteDoubleFBO(pressure);
    deleteFBO(divergence);
    deleteFBO(curl);
    velocity = null;
    dye = null;
    pressure = null;
    divergence = null;
    curl = null;
    for (const program of Object.values(programs)) {
      gl.deleteProgram(program.program);
    }
    gl.deleteShader(vertexShader);
    gl.deleteBuffer(quadBuffer);
    gl.deleteBuffer(indexBuffer);

    /* Hand the context back, but only once the element is really gone.
       While it is still in the document we are very likely being torn
       down and rebuilt by React's dev-only double mount, which reuses
       the same canvas — and a context that has been lost can never be
       revived, leaving the element painting opaque white from then on.
       Dropping the programs and textures covers that case. */
    if (!canvas.isConnected) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };

  return {
    splat,
    resize,
    frame(dt) {
      const step = Math.max(1 / 240, Math.min(dt, 1 / 30));
      hueClock += step;
      if (hueClock >= settings.hueInterval) {
        hueClock = 0;
        hue = (hue + settings.hueStep) % 1;
      }
      simulate(step);
      render();
    },
    color: () => colorAt(hue, settings.colorScale),
    clear,
    dispose,
  };
}
