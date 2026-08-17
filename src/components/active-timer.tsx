"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DailyTask, FocusSession } from "@/lib/domain/types";
import { elapsedSeconds, plannedDurationReached } from "@/lib/domain/timer";

export function ActiveTimer({ task, sessions }: { task: DailyTask; sessions: FocusSession[] }) {
  const [now, setNow] = useState(() => new Date()); const [soundEnabled, setSoundEnabled] = useState(false); const alerted = useRef(false);
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  const seconds = useMemo(() => elapsedSeconds(sessions, now), [sessions, now]); const reached = plannedDurationReached({ task, sessions }, now);
  useEffect(() => { if (!reached || alerted.current || !soundEnabled) return; alerted.current = true; const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 620; gain.gain.value = 0.035; oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.35); }, [reached, soundEnabled]);
  if (!task || task.status !== "running") return null;
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0"); const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"); const ss = String(seconds % 60).padStart(2, "0");
  return <section className={`panel mb-8 p-6 ${reached ? "border-amber-400 bg-amber-50" : "bg-[var(--accent-soft)]"}`}><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">foco agora</p><h2 className="mt-1 text-2xl font-black">{task.title}</h2><p className="mt-1 text-sm muted">{hh}:{mm}:{ss} · planejado {task.plannedDurationMinutes} min</p></div>{reached ? <div><p className="font-bold text-amber-800">Tempo planejado alcançado</p><p className="text-sm text-amber-700">Finalize ou acrescente 15 minutos na tarefa.</p></div> : <button className="btn btn-secondary" onClick={() => setSoundEnabled(true)}>{soundEnabled ? "Som habilitado" : "Habilitar aviso sonoro"}</button>}</div></section>;
}
