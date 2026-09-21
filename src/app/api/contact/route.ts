import { NextResponse } from "next/server";
import { Resend } from "resend";

import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  topic?: unknown;
  message?: unknown;
};

type Lead = {
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string;
  receivedAt: string;
};

const MAX_MESSAGE_LENGTH = 5000;

const DEFAULT_FROM = "HUMN Website <onboarding@resend.dev>";

const isString = (v: unknown): v is string => typeof v === "string";
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

function formatSubject(lead: Lead) {
  const organization = lead.organization ? ` (${oneLine(lead.organization)})` : "";
  return `New enquiry from ${oneLine(lead.name)}${organization}`;
}

function formatText(lead: Lead) {
  return [
    "New enquiry from the HUMN website",
    "",
    `Name:         ${lead.name}`,
    `Email:        ${lead.email}`,
    `Organization: ${lead.organization || "—"}`,
    `Topic:        ${lead.topic || "—"}`,
    `Received:     ${lead.receivedAt}`,
    "",
    "Message:",
    lead.message,
    "",
    `Reply to this email to answer ${lead.name} directly.`,
  ].join("\n");
}

function formatHtml(lead: Lead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Organization", lead.organization || "—"],
    ["Topic", lead.topic || "—"],
    ["Received", lead.receivedAt],
  ];

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f5f4ef;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:2px solid #111111;border-radius:16px;padding:24px">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">HUMN website</p>
      <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3">New enquiry from ${escapeHtml(lead.name)}</h1>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `<tr>
          <td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
          )
          .join("\n        ")}
      </table>
      <hr style="border:none;border-top:1px solid #dddddd;margin:20px 0" />
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#8a8a8a">
        Reply to this email to answer ${escapeHtml(lead.name)} directly at ${escapeHtml(lead.email)}.
      </p>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't read that request. Please try again." },
      { status: 400 },
    );
  }

  const { name, email, organization, topic, message } = body;

  if (!isString(name) || name.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: "Tell us your name." },
      { status: 400 },
    );
  }
  if (!isString(email) || !isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "We need a valid email to reply to." },
      { status: 400 },
    );
  }
  if (!isString(message) || message.trim().length < 10) {
    return NextResponse.json(
      { ok: false, error: "Give us a little more detail (at least 10 characters)." },
      { status: 400 },
    );
  }
  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        ok: false,
        error: `That message is a little long for a form. Please trim it to ${MAX_MESSAGE_LENGTH} characters, or email us directly.`,
      },
      { status: 400 },
    );
  }

  const lead: Lead = {
    name: name.trim(),
    email: email.trim(),
    organization: isString(organization) ? organization.trim() : "",
    topic: isString(topic) ? topic.trim() : "",
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "[contact] RESEND_API_KEY is not set, so this lead was not emailed:",
      JSON.stringify(lead),
    );
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't send that just now. Please email us directly at ${site.email}.`,
      },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
      to: site.email,
      replyTo: lead.email,
      subject: formatSubject(lead),
      text: formatText(lead),
      html: formatHtml(lead),
    });

    if (error) {
      console.error(
        "[contact] Resend rejected the send:",
        error,
        JSON.stringify(lead),
      );
      return NextResponse.json(
        {
          ok: false,
          error: `We couldn't send that just now. Please email us directly at ${site.email}.`,
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] Resend request failed:", err, JSON.stringify(lead));
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't send that just now. Please email us directly at ${site.email}.`,
      },
      { status: 502 },
    );
  }

  console.info(`[contact] lead emailed to ${site.email} from ${lead.email}`);

  return NextResponse.json({ ok: true });
}
