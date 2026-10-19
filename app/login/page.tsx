import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-[var(--background)]"
          aria-busy="true"
        />
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const params = await searchParams;
  return (
    <LoginForm
      errorCode={params.error}
      passwordReset={params.reset === "1"}
    />
  );
}
