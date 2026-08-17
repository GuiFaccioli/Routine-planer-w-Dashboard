import { describe, expect, it } from "vitest";
import { summarizeReport } from "./reports";

describe("summarizeReport", () => {
  it("compares planned and focused time by category", () => {
    const result = summarizeReport([
      { id: "a", userId: "u", templateId: null, date: "2026-08-17", title: "Faculdade", category: "Estudo", plannedStart: "13:00", plannedDurationMinutes: 90, status: "completed" },
      { id: "b", userId: "u", templateId: null, date: "2026-08-17", title: "Curso", category: "Estudo", plannedStart: "16:00", plannedDurationMinutes: 60, status: "planned" },
    ], [{ id: "s", dailyTaskId: "a", startedAt: "2026-08-17T16:00:00Z", endedAt: "2026-08-17T17:15:00Z" }]);
    expect(result).toMatchObject({ plannedMinutes: 150, focusedMinutes: 75, plannedTasks: 2, completedTasks: 1 });
    expect(result.byCategory.Estudo).toEqual({ plannedMinutes: 150, focusedMinutes: 75 });
  });
});
