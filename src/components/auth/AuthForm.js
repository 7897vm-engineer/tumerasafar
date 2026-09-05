"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(
        `/api/auth/${signup ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to continue.");
      router.push("/account");
      router.refresh();
    } catch (reason) {
      setError(reason.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <>
        {signup && (
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Full name
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="Your name"
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal"
            />
          </label>
        )}
      </>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
        Email address
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-xl border border-slate-200 px-4 py-3 font-normal"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
        Password
        <input
          required
          name="password"
          type="password"
          minLength="8"
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder="At least 8 characters"
          className="rounded-xl border border-slate-200 px-4 py-3 font-normal"
        />
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="mt-2 rounded-xl bg-[#073b3a] py-3.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Please wait…" : signup ? "Create my account" : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-500">
        {signup ? "Already have an account?" : "New to Tumerasafar?"}{" "}
        <Link
          className="font-bold text-teal-800"
          href={signup ? "/sign-in" : "/sign-up"}
        >
          {signup ? "Sign in" : "Create account"}
        </Link>
      </p>
    </form>
  );
}
