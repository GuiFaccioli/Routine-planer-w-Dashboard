"use server";

import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { dailyTasks, taskTemplateDays, taskTemplates, userSettings } from "@/lib/db/schema";
import { getWeekday } from "@/lib/domain/daily-generation";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.");

export async function ensureDailyTasks(dateKey: string) {
  const user = await requireUser();
  dateSchema.parse(dateKey);
  const db = getDb();
  const weekday = getWeekday(dateKey);
  const templates = await db.select().from(taskTemplates).innerJoin(taskTemplateDays, eq(taskTemplateDays.templateId, taskTemplates.id)).where(and(eq(taskTemplates.userId, user.id), eq(taskTemplates.isActive, true), eq(taskTemplateDays.weekday, weekday)));
  const existing = await db.select({ templateId: dailyTasks.templateId }).from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.date, dateKey)));
  const existingIds = new Set(existing.map((row) => row.templateId).filter((id): id is string => Boolean(id)));
  const pending = templates.filter(({ task_templates: template }) => !existingIds.has(template.id));
  if (pending.length) {
    await db.insert(dailyTasks).values(pending.map(({ task_templates: template }) => ({ userId: user.id, templateId: template.id, date: dateKey, title: template.title, category: template.category, plannedStart: template.defaultStartTime, plannedDurationMinutes: template.defaultDurationMinutes, status: "planned" as const })));
  }
  return listDailyTasks(dateKey);
}

export async function listDailyTasks(dateKey: string) {
  const user = await requireUser();
  dateSchema.parse(dateKey);
  const db = getDb();
  return db.select().from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.date, dateKey))).orderBy(asc(dailyTasks.plannedStart));
}

export async function createAdHocTask(input: { date: string; title: string; category: string; plannedStart: string; plannedDurationMinutes: number }) {
  const user = await requireUser();
  const parsed = z.object({ date: dateSchema, title: z.string().trim().min(1), category: z.string().trim().min(1), plannedStart: z.string().regex(/^\d{2}:\d{2}$/), plannedDurationMinutes: z.number().int().positive() }).parse(input);
  const db = getDb();
  const [task] = await db.insert(dailyTasks).values({ userId: user.id, ...parsed, templateId: null, status: "planned" }).returning();
  return task;
}

export async function updateTimeZone(timeZone: string) {
  const user = await requireUser();
  if (!Intl.supportedValuesOf("timeZone").includes(timeZone)) throw new Error("Fuso horário inválido.");
  const db = getDb();
  await db.insert(userSettings).values({ userId: user.id, timeZone }).onConflictDoUpdate({ target: userSettings.userId, set: { timeZone, updatedAt: new Date() } });
}

export async function getUserTimeZone() {
  const user = await requireUser();
  const db = getDb();
  const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));
  return settings?.timeZone ?? "America/Sao_Paulo";
}

export async function initializeTimeZone(timeZone: string) {
  const user = await requireUser();
  if (!Intl.supportedValuesOf("timeZone").includes(timeZone)) throw new Error("Fuso horário inválido.");
  const db = getDb();
  const [existing] = await db.select({ userId: userSettings.userId }).from(userSettings).where(eq(userSettings.userId, user.id));
  if (!existing) await db.insert(userSettings).values({ userId: user.id, timeZone });
}
