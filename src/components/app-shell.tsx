import { AppNav } from "./app-nav";
import { TimezoneBootstrap } from "./timezone-bootstrap";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="shell"><TimezoneBootstrap /><AppNav /><main>{children}</main></div>;
}
