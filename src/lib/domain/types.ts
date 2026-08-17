export const taskStatuses = ["planned", "running", "paused", "completed"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export type TaskTemplate = {
  id: string;
  userId: string;
  title: string;
  category: string;
  defaultStartTime: string;
  defaultDurationMinutes: number;
  daysOfWeek: number[];
  isActive: boolean;
};

export type DailyTask = {
  id: string;
  userId: string;
  templateId: string | null;
  date: string;
  title: string;
  category: string;
  plannedStart: string;
  plannedDurationMinutes: number;
  status: TaskStatus;
};

export type FocusSession = {
  id: string;
  dailyTaskId: string;
  startedAt: string;
  endedAt: string | null;
};
