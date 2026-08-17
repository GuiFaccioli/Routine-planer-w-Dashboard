import { createNeonAuth } from "@neondatabase/auth/next/server";
import { requireVerifiedUser } from "./verification";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL ?? "",
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET ?? "development-only-secret-change-me-32-chars" },
});

export async function requireUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Você precisa estar autenticado para continuar.");
  requireVerifiedUser(session.user);
  return session.user;
}
