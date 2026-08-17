import { getUserTimeZone } from "@/app/actions/daily-tasks";
import { AppShell } from "@/components/app-shell";
import { TimezoneSettings } from "@/components/timezone-settings";

export const dynamic = "force-dynamic";
export default async function SettingsPage() { return <AppShell><div className="container page" style={{ maxWidth: "820px" }}><p className="eyebrow">Configurações</p><h1 className="page-title">Um ritmo que cabe em você</h1><p className="page-intro">Preferências que deixam o planejamento fiel à sua rotina real.</p><div className="mt-8"><TimezoneSettings current={await getUserTimeZone()} /></div></div></AppShell>; }
