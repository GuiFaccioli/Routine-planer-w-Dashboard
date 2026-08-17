import { AppShell } from "@/components/app-shell";
import { getReport } from "@/app/actions/reports";
import { getUserTimeZone } from "@/app/actions/daily-tasks";
import { getDateKey } from "@/lib/domain/daily-generation";

export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const params = await searchParams; const today = getDateKey(new Date(), await getUserTimeZone()); const to = params.to ?? today; const from = params.from ?? to; const report = await getReport(from, to);
  const hours = (minutes: number) => `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, "0")}`;
  return <AppShell><div className="container py-10"><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">relatórios</p><h1 className="text-4xl font-black">Seu histórico, sem ruído</h1><p className="mt-2 max-w-xl muted">Compare planejamento e foco real por período.</p><form className="mt-6 flex flex-wrap items-end gap-3"><label className="grid gap-1 text-sm font-bold">De<input className="input" name="from" type="date" defaultValue={from} /></label><label className="grid gap-1 text-sm font-bold">Até<input className="input" name="to" type="date" defaultValue={to} /></label><button className="btn btn-secondary">Aplicar</button></form><div className="mt-8 grid gap-4 md:grid-cols-4">{[["Tempo planejado", hours(report.plannedMinutes)], ["Tempo focado", hours(report.focusedMinutes)], ["Tarefas planejadas", report.plannedTasks], ["Concluídas", report.completedTasks]].map(([label, value]) => <div className="panel p-5" key={String(label)}><p className="text-sm muted">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></div>)}</div><div className="panel mt-4 p-6"><h2 className="text-xl font-black">Planejado × realizado</h2>{Object.entries(report.byCategory).length ? <div className="mt-4 grid gap-3">{Object.entries(report.byCategory).map(([category, values]) => <div className="flex items-center justify-between border-b border-[var(--line)] py-3" key={category}><span className="font-bold">{category}</span><span className="text-sm muted">{hours(values.plannedMinutes)} planejado · {hours(values.focusedMinutes)} focado</span></div>)}</div> : <p className="mt-2 muted">Ainda não há dados neste período.</p>}</div></div></AppShell>;
}
