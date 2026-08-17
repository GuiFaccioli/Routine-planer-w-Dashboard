import type { DailyTask, FocusSession } from "./types";

export type ReportSummary = {
  plannedMinutes: number;
  focusedMinutes: number;
  plannedTasks: number;
  completedTasks: number;
  byCategory: Record<string, { plannedMinutes: number; focusedMinutes: number }>;
};

export function summarizeReport(tasks: DailyTask[], sessions: FocusSession[], now = new Date()): ReportSummary {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const byCategory: ReportSummary["byCategory"] = {};
  for (const task of tasks) {
    const current = byCategory[task.category] ?? { plannedMinutes: 0, focusedMinutes: 0 };
    current.plannedMinutes += task.plannedDurationMinutes;
    byCategory[task.category] = current;
  }
  for (const session of sessions) {
    const task = taskById.get(session.dailyTaskId); if (!task) continue;
    const end = session.endedAt ? new Date(session.endedAt) : now;
    const focusedMinutes = Math.max(0, Math.floor((end.getTime() - new Date(session.startedAt).getTime()) / 60000));
    byCategory[task.category].focusedMinutes += focusedMinutes;
  }
  return { plannedMinutes: tasks.reduce((sum, task) => sum + task.plannedDurationMinutes, 0), focusedMinutes: Object.values(byCategory).reduce((sum, item) => sum + item.focusedMinutes, 0), plannedTasks: tasks.length, completedTasks: tasks.filter((task) => task.status === "completed").length, byCategory };
}
