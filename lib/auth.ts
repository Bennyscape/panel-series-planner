export type UserRole = "pending" | "member" | "admin";

export function isUserRole(role: unknown): role is UserRole {
  return role === "pending" || role === "member" || role === "admin";
}

export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case "pending":
      return "/waiting";
    case "member":
      return "/home";
    case "admin":
      return "/dashboard";
  }
}
