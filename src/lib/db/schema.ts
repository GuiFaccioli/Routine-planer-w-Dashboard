import { relations, sql } from "drizzle-orm";
import { boolean, date, index, integer, pgTable, text, time, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  timeZone: text("time_zone").notNull().default("America/Sao_Paulo"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const taskTemplates = pgTable("task_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  defaultStartTime: time("default_start_time").notNull(),
  defaultDurationMinutes: integer("default_duration_minutes").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("task_templates_user_idx").on(table.userId)]);

export const taskTemplateDays = pgTable("task_template_days", {
  id: uuid("id").defaultRandom().primaryKey(),
  templateId: uuid("template_id").notNull().references(() => taskTemplates.id, { onDelete: "cascade" }),
  weekday: integer("weekday").notNull(),
}, (table) => [unique("task_template_days_template_weekday_unique").on(table.templateId, table.weekday)]);

export const dailyTasks = pgTable("daily_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  templateId: uuid("template_id").references(() => taskTemplates.id, { onDelete: "set null" }),
  date: date("date").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  plannedStart: time("planned_start").notNull(),
  plannedDurationMinutes: integer("planned_duration_minutes").notNull(),
  status: text("status", { enum: ["planned", "running", "paused", "completed"] }).default("planned").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("daily_tasks_user_date_idx").on(table.userId, table.date),
  index("daily_tasks_running_idx").on(table.userId, table.status),
  unique("daily_tasks_template_date_unique").on(table.userId, table.templateId, table.date),
]);

export const focusSessions = pgTable("focus_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  dailyTaskId: uuid("daily_task_id").notNull().references(() => dailyTasks.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("focus_sessions_task_idx").on(table.dailyTaskId)]);

export const taskTemplatesRelations = relations(taskTemplates, ({ many }) => ({ days: many(taskTemplateDays) }));
export const taskTemplateDaysRelations = relations(taskTemplateDays, ({ one }) => ({ template: one(taskTemplates, { fields: [taskTemplateDays.templateId], references: [taskTemplates.id] }) }));
export const dailyTasksRelations = relations(dailyTasks, ({ many, one }) => ({ template: one(taskTemplates, { fields: [dailyTasks.templateId], references: [taskTemplates.id] }), sessions: many(focusSessions) }));
export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({ task: one(dailyTasks, { fields: [focusSessions.dailyTaskId], references: [dailyTasks.id] }) }));

export const runningTaskInvariant = sql`CREATE UNIQUE INDEX IF NOT EXISTS daily_tasks_one_running_per_user ON daily_tasks (user_id) WHERE status = 'running';`;
