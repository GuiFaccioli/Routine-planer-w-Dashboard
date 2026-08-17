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
  return <AppShell><div className="container py-10"><section className="editorial-band mb-10 grid gap-8 rounded-2xl p-8 md:grid-cols-[1fr_auto] md:items-end md:p-10"><div><p className="mb-3 text-sm font-semibold uppercase tracking-[.16em] text-[#a8acb3]">meu dia</p><h1 className="text-4xl md:text-6xl">{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(date)}</h1><p className="mt-3 muted">{completed} de {tasks.length} tarefas concluídas · {Math.floor(totalMinutes / 60)}h{String(totalMinutes % 60).padStart(2, "0")} planejadas</p></div><div className="flex items-center gap-2"><Link className="btn btn-secondary" href={`/day?date=${shiftDate(date, -1)}`}>Anterior</Link><Link className="btn btn-primary" href="/day">Hoje</Link><Link className="btn btn-secondary" href={`/day?date=${shiftDate(date, 1)}`}>Próximo</Link></div></section>{active && <ActiveTimer task={active.task} sessions={activeSessions} />}<DayTimeline tasks={tasks} activeTaskId={active?.task.id} /></div></AppShell>;
}
