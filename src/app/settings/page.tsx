import { getUserTimeZone } from "@/app/actions/daily-tasks";
import { AppShell } from "@/components/app-shell";
import { TimezoneSettings } from "@/components/timezone-settings";

export const dynamic = "force-dynamic";
export default async function SettingsPage() { return <AppShell><div className="container max-w-3xl py-10"><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">configurações</p><h1 className="text-4xl font-black">Um ritmo que cabe em você</h1><div className="mt-8"><TimezoneSettings current={await getUserTimeZone()} /></div></div></AppShell>; }
