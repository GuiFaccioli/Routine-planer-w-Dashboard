import { redirect } from "next/navigation";

type VerifiableUser = { emailVerified?: boolean };

export function isEmailVerified(user: VerifiableUser): boolean {
  return user.emailVerified !== false;
}

export function requireVerifiedUser(user: VerifiableUser): void {
  if (!isEmailVerified(user)) redirect("/verify-email");
}
