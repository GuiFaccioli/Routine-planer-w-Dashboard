import { AppShell } from "@/components/app-shell";
import { getReport } from "@/app/actions/reports";
import { getUserTimeZone } from "@/app/actions/daily-tasks";
import { getDateKey } from "@/lib/domain/daily-generation";

export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const params = await searchParams; const today = getDateKey(new Date(), await getUserTimeZone()); const to = params.to ?? today; const from = params.from ?? to; const report = await getReport(from, to);
  const hours = (minutes: number) => `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, "0")}`;
  return <AppShell><div className="container page"><p className="eyebrow">Relatórios</p><h1 className="page-title">Seu histórico, sem ruído</h1><p className="page-intro">Compare planejamento e foco real por período.</p><form className="report-filter"><label className="field-label">De<input className="input" name="from" type="date" defaultValue={from} /></label><label className="field-label">Até<input className="input" name="to" type="date" defaultValue={to} /></label><button className="btn btn-secondary">Aplicar período</button></form><div className="metric-grid mt-8">{[["Tempo planejado", hours(report.plannedMinutes)], ["Tempo focado", hours(report.focusedMinutes)], ["Tarefas planejadas", report.plannedTasks], ["Concluídas", report.completedTasks]].map(([label, value]) => <div className="panel metric" key={String(label)}><p className="metric-label">{label}</p><p className="metric-value mono">{value}</p></div>)}</div><div className="panel mt-4 p-6"><div className="section-heading"><h2>Planejado × realizado</h2></div>{Object.entries(report.byCategory).length ? <div className="report-list">{Object.entries(report.byCategory).map(([category, values]) => <div className="report-row" key={category}><strong>{category}</strong><span>{hours(values.plannedMinutes)} planejado · {hours(values.focusedMinutes)} focado</span></div>)}</div> : <p className="muted">Ainda não há dados neste período.</p>}</div></div></AppShell>;
}
