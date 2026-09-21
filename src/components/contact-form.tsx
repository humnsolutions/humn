"use client";

import { useState } from "react";
import { ArrowRight, Check } from "@/components/ui";

type Status = "idle" | "sending" | "error" | "success";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const initialState = { name: "", email: "", organization: "", topic: "", message: "" };

const topics = [
  { value: "", label: "Pick one (or skip)" },
  { value: "recruitment-headhunting", label: "Hiring / recruitment help" },
  { value: "hr-outsourcing", label: "HR outsourcing, payroll or policies" },
  { value: "corporate-training-development", label: "Training for our team" },
  { value: "all-of-it", label: "Honestly, all of it" },
  { value: "other", label: "Something else entirely" },
];

export function ContactForm({
  defaultTopic = "",
}: {
  defaultTopic?: string;
}) {
  const [form, setForm] = useState({
    ...initialState,
    topic: topics.some((t) => t.value === defaultTopic) ? defaultTopic : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const update =
    (key: keyof typeof initialState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key as keyof Errors]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Tell us your name.";
    if (!form.email.trim()) next.email = "We need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "That email doesn't look right.";
    if (form.message.trim().length < 10)
      next.message = "Give us a sentence or two (at least 10 characters).";
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="pop-in flex flex-col items-start gap-4 rounded-2xl border-2 border-ink bg-paper p-8 shadow-pop sm:p-10"
      >
        <span className="stamp-in flex size-12 items-center justify-center rounded-full border-2 border-ink bg-ok text-paper">
          <Check className="size-6" />
        </span>
        <h2 className="font-display text-3xl font-semibold">
          Got it. We&apos;re on it.
        </h2>
        <p className="max-w-md leading-relaxed text-muted">
          A real human will reply to{" "}
          <span className="font-semibold text-ink">{form.email}</span> within
          one business day. If it&apos;s urgent, email us directly at{" "}
          <a
            href="mailto:humnsolutions@gmail.com"
            className="font-semibold underline decoration-signal decoration-2 underline-offset-4"
          >
            humnsolutions@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          className="btn btn-paper mt-2"
          onClick={() => {
            setForm(initialState);
            setStatus("idle");
          }}
        >
          Send another note
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border-2 border-ink bg-paper px-4 py-3 text-base outline-none transition-shadow placeholder:text-faint focus-visible:shadow-[3px_3px_0_0_var(--color-ink)]";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-bold">
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Rivera"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            className={inputBase}
          />
          {errors.name ? (
            <p id="cf-name-error" role="alert" className="mt-1.5 text-sm font-semibold text-signal-deep">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-bold">
            Work email <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@company.com"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
            className={inputBase}
          />
          {errors.email ? (
            <p id="cf-email-error" role="alert" className="mt-1.5 text-sm font-semibold text-signal-deep">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-org" className="mb-1.5 block text-sm font-bold">
            Organization
          </label>
          <input
            id="cf-org"
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder="Company or team"
            value={form.organization}
            onChange={update("organization")}
            className={inputBase}
          />
        </div>
        <div>
          <label htmlFor="cf-topic" className="mb-1.5 block text-sm font-bold">
            What&apos;s the situation?
          </label>
          <select
            id="cf-topic"
            name="topic"
            value={form.topic}
            onChange={update("topic")}
            className={inputBase}
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-bold">
          What&apos;s broken? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          placeholder="Tell us what's happening. The messier the brief, the better we can help."
          value={form.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          className={`${inputBase} resize-y`}
        />
        {errors.message ? (
          <p id="cf-message-error" role="alert" className="mt-1.5 text-sm font-semibold text-signal-deep">
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-xl border-2 border-signal-deep bg-paper p-4 font-semibold text-signal-deep">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-signal disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? "Sending..." : "Send the note"}
          <ArrowRight className="size-5" />
        </button>
        <p className="text-sm text-muted">
          Prefer email?{" "}
          <a
            href="mailto:humnsolutions@gmail.com"
            className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
          >
            humnsolutions@gmail.com
          </a>
        </p>
      </div>
    </form>
  );
}
