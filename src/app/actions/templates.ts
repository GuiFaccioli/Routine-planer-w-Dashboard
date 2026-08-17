"use server";

import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { templateInput } from "@/lib/domain/template-input";
import { taskTemplateDays, taskTemplates } from "@/lib/db/schema";

export async function listTemplates() {
  const user = await requireUser();
  const db = getDb();
  const rows = await db.select().from(taskTemplates).where(eq(taskTemplates.userId, user.id)).orderBy(asc(taskTemplates.defaultStartTime));
  const days = rows.length ? await db.select().from(taskTemplateDays).where(inArray(taskTemplateDays.templateId, rows.map((row) => row.id))) : [];
  return rows.map((template) => ({ ...template, daysOfWeek: days.filter((day) => day.templateId === template.id).map((day) => day.weekday) }));
}

export async function createTemplate(input: z.input<typeof templateInput>) {
  const user = await requireUser();
  const parsed = templateInput.parse(input);
  const { daysOfWeek, ...templateValues } = parsed;
  const db = getDb();
  return db.transaction(async (tx) => {
    const [template] = await tx.insert(taskTemplates).values({ userId: user.id, ...templateValues }).returning();
    await tx.insert(taskTemplateDays).values(daysOfWeek.map((weekday) => ({ templateId: template.id, weekday })));
    return template;
  });
}

export async function updateTemplate(templateId: string, input: z.input<typeof templateInput>) {
  const user = await requireUser();
  const parsed = templateInput.parse(input);
  const { daysOfWeek, ...templateValues } = parsed;
  const db = getDb();

  return db.transaction(async (tx) => {
    const [template] = await tx.update(taskTemplates)
      .set({ ...templateValues, updatedAt: new Date() })
      .where(and(eq(taskTemplates.id, templateId), eq(taskTemplates.userId, user.id)))
      .returning();
    if (!template) throw new Error("A rotina não foi encontrada.");

    await tx.delete(taskTemplateDays).where(eq(taskTemplateDays.templateId, templateId));
    await tx.insert(taskTemplateDays).values(daysOfWeek.map((weekday) => ({ templateId, weekday })));
    return template;
  });
}

export async function archiveTemplate(templateId: string) {
  const user = await requireUser();
  const db = getDb();
  const result = await db.update(taskTemplates).set({ isActive: false, updatedAt: new Date() }).where(and(eq(taskTemplates.id, templateId), eq(taskTemplates.userId, user.id))).returning({ id: taskTemplates.id });
  if (!result[0]) throw new Error("A rotina não foi encontrada.");
}

export async function restoreTemplate(templateId: string) {
  const user = await requireUser();
  const db = getDb();
  const result = await db.update(taskTemplates)
    .set({ isActive: true, updatedAt: new Date() })
    .where(and(eq(taskTemplates.id, templateId), eq(taskTemplates.userId, user.id)))
    .returning({ id: taskTemplates.id });
  if (!result[0]) throw new Error("A rotina não foi encontrada.");
}
