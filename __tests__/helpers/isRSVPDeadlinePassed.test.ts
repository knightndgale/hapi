import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import isRSVPDeadlinePassed from "@/helpers/isRSVPDeadlinePassed";

describe("isRSVPDeadlinePassed", () => {
  beforeEach(() => {
    // Mock the current date to 2024-03-20
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-20"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for past dates", () => {
    const pastDate = "2024-03-19";
    const result = isRSVPDeadlinePassed(pastDate);
    expect(result).toBe(true);
  });

  it("returns false for future dates", () => {
    const futureDate = "2024-03-21";
    const result = isRSVPDeadlinePassed(futureDate);
    expect(result).toBe(false);
  });

  it("returns false for current date", () => {
    const currentDate = "2024-03-20";
    const result = isRSVPDeadlinePassed(currentDate);
    expect(result).toBe(false);
  });
});
