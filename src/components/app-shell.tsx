import { requireUser } from "@/lib/auth/server";
import { AppNav } from "./app-nav";
import { TimezoneBootstrap } from "./timezone-bootstrap";

export async function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireUser();
  return <div className="shell"><TimezoneBootstrap /><AppNav /><main>{children}</main></div>;
}
