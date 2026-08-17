"use server";

import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { dailyTasks, focusSessions } from "@/lib/db/schema";
import { summarizeReport } from "@/lib/domain/reports";

export async function getReport(from: string, to: string) {
  const user = await requireUser();
  const dates = z.object({ from: z.string().date(), to: z.string().date() }).parse({ from, to });
  if (dates.from > dates.to) throw new Error("O início do período deve ser anterior ao fim.");
  const db = getDb();
  const tasks = await db.select().from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), gte(dailyTasks.date, dates.from), lte(dailyTasks.date, dates.to)));
  const sessions = tasks.length ? await db.select().from(focusSessions).where(inArray(focusSessions.dailyTaskId, tasks.map((task) => task.id))) : [];
  return summarizeReport(tasks, sessions.map((session) => ({ id: session.id, dailyTaskId: session.dailyTaskId, startedAt: session.startedAt.toISOString(), endedAt: session.endedAt?.toISOString() ?? null })));
}
