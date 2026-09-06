"use client";
import { useState } from "react";
export default function EnquiryForm() {
  const [status, setStatus] = useState("");
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("Sending...");
    const data = Object.fromEntries(new FormData(form));
    try {
      if (!apiBase) throw new Error("API is not configured");
      const r = await fetch(`${apiBase}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("Enquiry response:", r);
      if (!r.ok) throw Error();
      form.reset();
      setStatus("Thank you — we’ll be in touch shortly.");
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  }
  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-3xl bg-white p-6 text-slate-900"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Your name"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />
        <input
          required
          name="phone"
          type="tel"
          placeholder="Phone number"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>
      <input
        required
        name="email"
        type="email"
        placeholder="Email address"
        className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
      />
      <textarea
        name="message"
        placeholder="Where would you like to go?"
        className="min-h-20 rounded-xl border border-slate-200 px-4 py-3 text-sm"
      />
      <button className="rounded-xl bg-[#d4664d] py-3.5 text-sm font-bold text-white">
        Start planning
      </button>
      {status && (
        <p aria-live="polite" className="text-center text-sm text-teal-700">
          {status}
        </p>
      )}
    </form>
  );
}
