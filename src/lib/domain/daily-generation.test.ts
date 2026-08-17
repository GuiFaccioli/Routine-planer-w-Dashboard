import { describe, expect, it } from "vitest";
import { generateDailyTasks } from "./daily-generation";
import type { TaskTemplate } from "./types";

const template: TaskTemplate = {
  id: "tpl-1",
  userId: "user-1",
  title: "Faculdade",
  category: "Estudo",
  defaultStartTime: "13:00",
  defaultDurationMinutes: 90,
  daysOfWeek: [1, 2, 3, 4, 5],
  isActive: true,
};

describe("generateDailyTasks", () => {
  it("creates one occurrence for an active template on its weekday", () => {
    const result = generateDailyTasks("2026-08-17", [template], [], () => "daily-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ title: "Faculdade", date: "2026-08-17", templateId: "tpl-1" });
  });

  it("is idempotent when the occurrence already exists", () => {
    const existing = generateDailyTasks("2026-08-17", [template], [], () => "daily-1");
    const result = generateDailyTasks("2026-08-17", [template], existing, () => "daily-2");
    expect(result).toEqual([]);
  });

  it("does not generate archived templates", () => {
    expect(generateDailyTasks("2026-08-17", [{ ...template, isActive: false }], [], () => "id")).toEqual([]);
  });
});
