"use server";

import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { taskTemplateDays, taskTemplates } from "@/lib/db/schema";

const templateInput = z.object({
  title: z.string().trim().min(1, "Informe um nome para a rotina."),
  category: z.string().trim().min(1, "Informe uma categoria."),
  defaultStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Informe um horário válido."),
  defaultDurationMinutes: z.coerce.number().int().positive("A duração deve ser maior que zero."),
  daysOfWeek: z.array(z.coerce.number().int().min(0).max(6)).min(1, "Escolha pelo menos um dia."),
});

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

export async function archiveTemplate(templateId: string) {
  const user = await requireUser();
  const db = getDb();
  const result = await db.update(taskTemplates).set({ isActive: false, updatedAt: new Date() }).where(and(eq(taskTemplates.id, templateId), eq(taskTemplates.userId, user.id))).returning({ id: taskTemplates.id });
  if (!result[0]) throw new Error("A rotina não foi encontrada.");
}
