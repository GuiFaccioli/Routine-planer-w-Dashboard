"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { extendTaskBy15Minutes, finishTask, pauseTask, resumeTask, startTask, switchRunningTask } from "@/app/actions/timer";
import type { DailyTask } from "@/lib/domain/types";

export function TaskControls({ task, activeTaskId }: { task: DailyTask; activeTaskId?: string }) {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function run(action: () => Promise<unknown>) { setPending(true); setError(""); try { await action(); router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar a tarefa."); } finally { setPending(false); } }
  const button = (label: string, action: () => Promise<unknown>, primary = false) => <button className={`btn ${primary ? "btn-primary" : "btn-secondary"}`} disabled={pending} onClick={() => run(action)}>{label}</button>;
  const start = () => { if (activeTaskId && activeTaskId !== task.id) { if (!window.confirm("A tarefa atual será pausada. Iniciar esta tarefa?")) return Promise.resolve(); return switchRunningTask(task.id); } return startTask(task.id); };
  return <div className="mt-4 flex flex-wrap items-center gap-2">{task.status === "planned" && button("Iniciar", start, true)}{task.status === "running" && <>{button("Pausar", () => pauseTask(task.id))}{button("Finalizar", () => finishTask(task.id), true)}{button("+15 min", () => extendTaskBy15Minutes(task.id))}</>}{task.status === "paused" && <>{button("Continuar", () => resumeTask(task.id), true)}{button("Finalizar", () => finishTask(task.id))}</>}{error && <span className="basis-full text-sm text-red-700">{error}</span>}</div>;
}
