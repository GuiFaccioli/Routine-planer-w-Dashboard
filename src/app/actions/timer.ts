"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { requireUser } from "@/lib/auth/server";
import { getDb } from "@/lib/db/client";
import { dailyTasks, focusSessions } from "@/lib/db/schema";

type QueryClient = Pick<ReturnType<typeof getDb>, "select">;

async function getOwnedTask(tx: QueryClient, userId: string, taskId: string) {
  const [task] = await tx.select().from(dailyTasks).where(and(eq(dailyTasks.id, taskId), eq(dailyTasks.userId, userId)));
  if (!task) throw new Error("A tarefa não foi encontrada.");
  return task;
}

export async function startTask(taskId: string) {
  const user = await requireUser();
  const db = getDb();
  return db.transaction(async (tx) => {
    const task = await getOwnedTask(tx, user.id, taskId);
    if (task.status !== "planned") throw new Error("Esta tarefa não pode ser iniciada neste estado.");
    const [running] = await tx.select({ id: dailyTasks.id, title: dailyTasks.title }).from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.status, "running")));
    if (running) throw new Error(`Não é possível iniciar esta tarefa enquanto ${running.title} está em andamento.`);
    await tx.update(dailyTasks).set({ status: "running", updatedAt: new Date() }).where(eq(dailyTasks.id, taskId));
    await tx.insert(focusSessions).values({ dailyTaskId: taskId, startedAt: new Date() });
    return taskId;
  });
}

export async function pauseTask(taskId: string) {
  return changeRunningTask(taskId, "paused");
}

export async function resumeTask(taskId: string) {
  const user = await requireUser();
  const db = getDb();
  return db.transaction(async (tx) => {
    const task = await getOwnedTask(tx, user.id, taskId);
    if (task.status !== "paused") throw new Error("A tarefa precisa estar pausada para continuar.");
    const [running] = await tx.select({ title: dailyTasks.title }).from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.status, "running")));
    if (running) throw new Error(`Não é possível continuar enquanto ${running.title} está em andamento.`);
    await tx.update(dailyTasks).set({ status: "running", updatedAt: new Date() }).where(eq(dailyTasks.id, taskId));
    await tx.insert(focusSessions).values({ dailyTaskId: taskId, startedAt: new Date() });
  });
}

export async function finishTask(taskId: string) {
  return changeRunningTask(taskId, "completed");
}

async function changeRunningTask(taskId: string, status: "paused" | "completed") {
  const user = await requireUser();
  const db = getDb();
  return db.transaction(async (tx) => {
    const task = await getOwnedTask(tx, user.id, taskId);
    if (task.status !== "running") throw new Error("Esta tarefa não está em andamento.");
    await tx.update(focusSessions).set({ endedAt: new Date() }).where(and(eq(focusSessions.dailyTaskId, taskId), isNull(focusSessions.endedAt)));
    await tx.update(dailyTasks).set({ status, updatedAt: new Date() }).where(eq(dailyTasks.id, taskId));
  });
}

export async function switchRunningTask(taskId: string) {
  const user = await requireUser();
  const db = getDb();
  return db.transaction(async (tx) => {
    const next = await getOwnedTask(tx, user.id, taskId);
    if (next.status !== "planned") throw new Error("A nova tarefa precisa estar planejada.");
    const [current] = await tx.select().from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.status, "running")));
    if (!current) {
      await tx.update(dailyTasks).set({ status: "running", updatedAt: new Date() }).where(eq(dailyTasks.id, taskId));
      await tx.insert(focusSessions).values({ dailyTaskId: taskId, startedAt: new Date() });
      return;
    }
    await tx.update(focusSessions).set({ endedAt: new Date() }).where(and(eq(focusSessions.dailyTaskId, current.id), isNull(focusSessions.endedAt)));
    await tx.update(dailyTasks).set({ status: "paused", updatedAt: new Date() }).where(eq(dailyTasks.id, current.id));
    await tx.update(dailyTasks).set({ status: "running", updatedAt: new Date() }).where(eq(dailyTasks.id, taskId));
    await tx.insert(focusSessions).values({ dailyTaskId: taskId, startedAt: new Date() });
  });
}

export async function getActiveTask() {
  const user = await requireUser();
  const db = getDb();
  const [task] = await db.select().from(dailyTasks).where(and(eq(dailyTasks.userId, user.id), eq(dailyTasks.status, "running")));
  if (!task) return null;
  const sessions = await db.select().from(focusSessions).where(eq(focusSessions.dailyTaskId, task.id)).orderBy(desc(focusSessions.startedAt));
  return { task, sessions };
}
