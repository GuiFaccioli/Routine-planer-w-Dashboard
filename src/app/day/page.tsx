import Link from "next/link";
import { ensureDailyTasks, getUserTimeZone } from "@/app/actions/daily-tasks";
import { getActiveTask } from "@/app/actions/timer";
import { AppShell } from "@/components/app-shell";
import { DayTimeline } from "@/components/day-timeline";
import { ActiveTimer } from "@/components/active-timer";
import { getDateKey } from "@/lib/domain/daily-generation";

export const dynamic = "force-dynamic";

function shiftDate(date: Date, amount: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

export default async function DayPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams; const timeZone = await getUserTimeZone();
  const selected = params.date ?? getDateKey(new Date(), timeZone); const date = new Date(`${selected}T12:00:00`);
  const tasks = await ensureDailyTasks(selected); const active = await getActiveTask(); const completed = tasks.filter((task) => task.status === "completed").length;
  const totalMinutes = tasks.reduce((sum, task) => sum + task.plannedDurationMinutes, 0);
  const activeSessions = active?.sessions.map((session) => ({ id: session.id, dailyTaskId: session.dailyTaskId, startedAt: session.startedAt.toISOString(), endedAt: session.endedAt?.toISOString() ?? null })) ?? [];
  return <AppShell><div className="container page"><div className="hero-row"><div><p className="eyebrow">Meu dia</p><h1 className="page-title">{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(date)}</h1><p className="summary-line"><strong>{completed}</strong> de {tasks.length} tarefas concluídas · <strong>{Math.floor(totalMinutes / 60)}h{String(totalMinutes % 60).padStart(2, "0")}</strong> planejadas</p></div><div className="date-actions"><Link className="btn btn-outline" href={`/day?date=${shiftDate(date, -1)}`} aria-label="Dia anterior">←</Link><Link className="btn btn-secondary" href="/day">Hoje</Link><Link className="btn btn-outline" href={`/day?date=${shiftDate(date, 1)}`} aria-label="Próximo dia">→</Link></div></div>{active && <ActiveTimer key={active.task.id} task={active.task} sessions={activeSessions} />}<div className="section-heading mt-10"><h2>Agenda do dia</h2><span className="help-text">{tasks.length} itens</span></div><DayTimeline tasks={tasks} activeTaskId={active?.task.id} /></div></AppShell>;
}
