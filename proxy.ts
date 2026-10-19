import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRoleRedirectPath, isUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function redirectTo(
  request: NextRequest,
  pathname: string,
  search = "",
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([header, value]) => {
            response.headers.set(header, value);
          });
        },
      },
    },
  );

  if (request.nextUrl.pathname === "/auth/callback") {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/restricted",
  ];
  const isPublicPath = publicPaths.includes(pathname);
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims.sub;

  if (!userId) {
    return isPublicPath ? response : redirectTo(request, "/login");
  }

  const { data: roleValue, error: roleError } =
    await supabase.rpc("get_my_role");
  if (roleError || !isUserRole(roleValue)) {
    return redirectTo(request, "/login", "?error=profile");
  }

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return redirectTo(request, getRoleRedirectPath(roleValue));
  }

  if (roleValue === "pending") {
    return pathname === "/waiting" ? response : redirectTo(request, "/waiting");
  }

  if (pathname === "/waiting") {
    return redirectTo(request, getRoleRedirectPath(roleValue));
  }

  if (
    roleValue === "member" &&
    (pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/members" ||
      pathname.startsWith("/members/"))
  ) {
    return redirectTo(request, "/restricted");
  }

  if (roleValue === "admin" && pathname === "/home") {
    return redirectTo(request, "/dashboard");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
