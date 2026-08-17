import { describe, expect, it } from "vitest";
import { templateInput } from "@/lib/domain/template-input";

describe("template input", () => {
  it("accepts a 60-minute routine", () => {
    const parsed = templateInput.parse({
      title: "Deep work",
      category: "Study",
      defaultStartTime: "09:00",
      defaultDurationMinutes: "60",
      daysOfWeek: [1],
    });

    expect(parsed.defaultDurationMinutes).toBe(60);
  });
});
