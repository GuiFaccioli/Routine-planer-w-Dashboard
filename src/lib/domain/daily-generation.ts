import type { DailyTask, TaskTemplate } from "./types";

export function getDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getWeekday(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function generateDailyTasks(
  dateKey: string,
  templates: TaskTemplate[],
  existing: DailyTask[],
  createId: () => string,
): DailyTask[] {
  const existingTemplateIds = new Set(
    existing.filter((task) => task.date === dateKey && task.templateId).map((task) => task.templateId),
  );
  const weekday = getWeekday(dateKey);

  return templates
    .filter((template) => template.isActive && template.daysOfWeek.includes(weekday))
    .filter((template) => !existingTemplateIds.has(template.id))
    .map((template) => ({
      id: createId(),
      userId: template.userId,
      templateId: template.id,
      date: dateKey,
      title: template.title,
      category: template.category,
      plannedStart: template.defaultStartTime,
      plannedDurationMinutes: template.defaultDurationMinutes,
      status: "planned" as const,
    }));
}
