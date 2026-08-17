import Link from "next/link";
import { ensureDailyTasks, getUserTimeZone } from "@/app/actions/daily-tasks";
import { getActiveTask } from "@/app/actions/timer";
import { AppShell } from "@/components/app-shell";
import { DayTimeline } from "@/components/day-timeline";
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
  return <AppShell><div className="container py-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">meu dia</p><h1 className="text-4xl font-black tracking-tight">{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(date)}</h1><p className="mt-2 muted">{completed} de {tasks.length} tarefas concluídas · {Math.floor(totalMinutes / 60)}h{String(totalMinutes % 60).padStart(2, "0")} planejadas</p></div><div className="flex items-center gap-2"><Link className="btn btn-secondary" href={`/day?date=${shiftDate(date, -1)}`}>←</Link><Link className="btn btn-secondary" href="/day">Hoje</Link><Link className="btn btn-secondary" href={`/day?date=${shiftDate(date, 1)}`}>→</Link></div></div><DayTimeline tasks={tasks} activeTaskId={active?.task.id} /></div></AppShell>;
}
