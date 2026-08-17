import { getUserTimeZone } from "@/app/actions/daily-tasks";
import { AppShell } from "@/components/app-shell";
import { TimezoneSettings } from "@/components/timezone-settings";

export const dynamic = "force-dynamic";
export default async function SettingsPage() { return <AppShell><div className="container max-w-3xl py-10"><p className="mb-3 text-sm font-semibold uppercase tracking-[.16em] text-[var(--accent)]">configurações</p><h1 className="text-4xl md:text-6xl">Um ritmo que cabe em você</h1><p className="mt-3 max-w-xl muted">Ajuste o contexto que faz seu planejamento funcionar no mundo real.</p><div className="mt-10"><TimezoneSettings current={await getUserTimeZone()} /></div></div></AppShell>; }
