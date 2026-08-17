import type { DailyTask, FocusSession, TaskStatus } from "./types";

export type TimerState = {
  task: DailyTask;
  sessions: FocusSession[];
};

export function elapsedSeconds(sessions: FocusSession[], now: Date): number {
  return sessions.reduce((total, session) => {
    const end = session.endedAt ? new Date(session.endedAt) : now;
    return total + Math.max(0, Math.floor((end.getTime() - new Date(session.startedAt).getTime()) / 1000));
  }, 0);
}

export function transitionStatus(current: TaskStatus, next: TaskStatus): void {
  const allowed: Record<TaskStatus, TaskStatus[]> = {
    planned: ["running"],
    running: ["paused", "completed"],
    paused: ["running", "completed"],
    completed: [],
  };
  if (!allowed[current].includes(next)) {
    throw new Error(`Não é possível mudar uma tarefa de ${current} para ${next}.`);
  }
}

export function plannedDurationReached(state: TimerState, now: Date): boolean {
  return elapsedSeconds(state.sessions, now) >= state.task.plannedDurationMinutes * 60;
}
