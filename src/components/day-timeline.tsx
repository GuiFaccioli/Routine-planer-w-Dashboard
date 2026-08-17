import { TaskControls } from "./task-controls";
import type { DailyTask } from "@/lib/domain/types";

const statusLabel = { planned: "Planejada", running: "Em andamento", paused: "Pausada", completed: "Concluída" };

export function DayTimeline({ tasks, activeTaskId }: { tasks: DailyTask[]; activeTaskId?: string }) {
  if (!tasks.length) return <div className="panel p-10 text-center"><h2 className="text-xl font-black">Seu dia está aberto</h2><p className="mt-2 muted">Crie uma rotina ou adicione uma tarefa avulsa para começar.</p></div>;
  return <div className="relative grid gap-5 pl-0"><div className="timeline-line" />{tasks.map((task) => <article className="relative grid grid-cols-[64px_1fr] gap-5" key={task.id}><time className="pt-4 text-right text-sm font-bold text-[var(--muted)]">{task.plannedStart.slice(0, 5)}</time><div className={`panel relative z-1 p-5 ${task.status === "running" ? "border-[var(--accent)] ring-2 ring-[var(--accent-soft)]" : ""}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-black">{task.title}</h2><p className="mt-1 text-sm muted">{task.category} · {task.plannedDurationMinutes} min planejados</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${task.status === "completed" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--warm)] text-[var(--muted)]"}`}>{statusLabel[task.status]}</span></div><TaskControls task={task} activeTaskId={activeTaskId} /></div></article>)}</div>;
}
