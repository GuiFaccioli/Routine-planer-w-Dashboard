import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/sign-in" });

export const config = {
  matcher: ["/((?!_next|api/auth|sign-in|sign-up|forgot-password|verify-email).*)"],
};
