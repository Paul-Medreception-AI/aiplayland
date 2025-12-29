"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [renderedAt] = useState(() => Date.now());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("renderedAt", renderedAt.toString());
    formData.append("timeElapsedMs", Math.max(Date.now() - renderedAt, 0).toString());
    const payload = Object.fromEntries(formData.entries());

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Contact form submission failed", error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to send message.");
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight mb-4 display-heading">Contact AIPlayLand</h1>

      <p className="text-lg leading-relaxed text-slate-600 mb-10">
        Have a question, suggestion, or AI tool we should check out? We read every message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">What’s this about?</label>
          <select
            name="topic"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option>Suggest an AI tool</option>
            <option>Partnership</option>
            <option>General question</option>
            <option>Something else</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Message</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Include links if you're suggesting an AI tool."
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Thanks! Your message is on its way.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {errorMessage || "We couldn’t send that. Try again in a minute."}
        </p>
      )}

      <p className="mt-10 text-sm leading-relaxed text-slate-500">
        Looking to build or integrate something more advanced?
        <br />
        <span className="font-semibold text-slate-800">We’ll point you in the right direction.</span>
      </p>
    </main>
  );
}
