import { describe, expect, it } from "vitest";
import { elapsedSeconds, plannedDurationReached, transitionStatus } from "./timer";
import type { TimerState } from "./timer";

describe("focus timer", () => {
  it("sums separate focus sessions and an open session from timestamps", () => {
    const now = new Date("2026-08-17T18:00:00Z");
    expect(elapsedSeconds([
      { id: "1", dailyTaskId: "task", startedAt: "2026-08-17T16:00:00Z", endedAt: "2026-08-17T16:38:00Z" },
      { id: "2", dailyTaskId: "task", startedAt: "2026-08-17T17:00:00Z", endedAt: null },
    ], now)).toBe(5880);
  });

  it("detects the planned duration without relying on a counter", () => {
    const state: TimerState = {
      task: { id: "task", userId: "u", templateId: null, date: "2026-08-17", title: "Testes", category: "Trabalho", plannedStart: "16:00", plannedDurationMinutes: 60, status: "running" },
      sessions: [{ id: "1", dailyTaskId: "task", startedAt: "2026-08-17T16:00:00Z", endedAt: null }],
    };
    expect(plannedDurationReached(state, new Date("2026-08-17T17:00:01Z"))).toBe(true);
  });

  it("keeps counting actual focus after the planned duration", () => {
    const now = new Date("2026-08-17T00:00:00Z");
    expect(elapsedSeconds([
      { id: "1", dailyTaskId: "task", startedAt: "2026-08-16T14:00:00Z", endedAt: "2026-08-17T00:00:00Z" },
    ], now)).toBe(10 * 60 * 60);
  });

  it("rejects invalid status transitions", () => {
    expect(() => transitionStatus("completed", "running")).toThrow("Não é possível");
  });
});
