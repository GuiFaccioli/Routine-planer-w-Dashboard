import { describe, expect, it } from "vitest";
import { isEmailVerified } from "./verification";

describe("email verification guard", () => {
  it("rejects explicitly unverified users", () => {
    expect(isEmailVerified({ emailVerified: false })).toBe(false);
  });

  it("allows verified users", () => {
    expect(isEmailVerified({ emailVerified: true })).toBe(true);
  });
});
