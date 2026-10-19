"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        "Check your email for a confirmation link. Once confirmed, your account will wait for admin approval.",
      );
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create your account.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(29,27,25,0.06)]">
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create account</div>
        <h1 className="mt-2 font-serif text-4xl text-[var(--text)]">Join the cohort</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Confirm your email, then wait for an admin to approve your access.
        </p>

        {message ? (
          <p role="status" className="mt-4 rounded-md bg-[#e6f3ed] px-3 py-2 text-sm text-[#356d4a]">
            {message}
          </p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="mt-4 rounded-md bg-[#fbe8e8] px-3 py-2 text-sm text-[#9d2923]">
            {errorMessage}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-[var(--text)]">
            Full name
            <input
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)]"
            />
          </label>

          <label className="block text-sm text-[var(--text)]">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)]"
            />
          </label>

          <label className="block text-sm text-[var(--text)]">
            Password
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)]"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#004b45] disabled:opacity-60"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--muted)]">
          Already have an account? <Link href="/login" className="font-medium text-[var(--primary)]">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
