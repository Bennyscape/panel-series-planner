import { NextResponse, type NextRequest } from "next/server";
import { getRoleRedirectPath, isUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function loginError(request: NextRequest, code: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?error=${encodeURIComponent(code)}`;
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return loginError(request, "config");
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return loginError(request, "callback");
  }

  const supabase = await createClient();
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return loginError(request, "callback");
  }

  if (request.nextUrl.searchParams.get("next") === "/reset-password") {
    const url = request.nextUrl.clone();
    url.pathname = "/reset-password";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return loginError(request, "callback");
  }

  const { data: role, error: roleError } =
    await supabase.rpc("get_my_role");
  if (roleError || !isUserRole(role)) {
    return loginError(request, "profile");
  }

  const url = request.nextUrl.clone();
  url.pathname = getRoleRedirectPath(role);
  url.search = "";
  return NextResponse.redirect(url);
}
