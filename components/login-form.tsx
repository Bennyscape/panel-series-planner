"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck, Pin } from "lucide-react";
import { getRoleRedirectPath, isUserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

function getInitialMessage(errorCode?: string, passwordReset?: boolean) {
  if (passwordReset) {
    return "Your password has been changed. Sign in with the new password.";
  }

  if (errorCode === "config") {
    return "Authentication is not configured yet. Set the Supabase project URL and publishable key.";
  }

  if (errorCode) {
    return "We couldn't verify your account. Please sign in again or contact the administrator.";
  }

  return "";
}

export function LoginForm({
  errorCode,
  passwordReset,
}: {
  errorCode?: string;
  passwordReset?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    getInitialMessage(errorCode, passwordReset),
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const { data: role, error: roleError } =
        await supabase.rpc("get_my_role");  
      if (roleError || !isUserRole(role)) {
        const { error: signOutError } = await supabase.auth.signOut();
        setErrorMessage(
          signOutError
            ? `${roleError?.message ?? "Your account profile is unavailable."} Sign-out also failed: ${signOutError.message}`
            : roleError?.message ??
              "Your account profile is unavailable. Contact the administrator.",
        );
        return;
      }

      router.replace(getRoleRedirectPath(role));
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setBusy(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setBusy(false);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start Google sign-in.",
      );
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(29,27,25,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Access</div>
            <div className="font-serif text-2xl text-[var(--text)]">Series Planner</div>
          </div>
        </div>

        <h1 className="mt-6 font-serif text-4xl text-[var(--text)]">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to continue to your panel series workspace.
        </p>

        {errorMessage ? (
          <p role="alert" className="mt-4 rounded-md bg-[#fbe8e8] px-3 py-2 text-sm text-[#9d2923]">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface)] disabled:opacity-60"
        >
          <span aria-hidden="true" className="font-bold text-[#4285f4]">G</span>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--border)]" />
          or sign in with email
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)]"
            />
          </label>

          <div className="text-right text-xs">
            <Link href="/forgot-password" className="font-medium text-[var(--primary)]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#004b45] disabled:opacity-60"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Need access?</span>
          <Link href="/signup" className="font-medium text-[var(--primary)]">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
