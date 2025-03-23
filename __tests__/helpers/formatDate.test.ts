import { describe, it, expect } from "vitest";
import formatDate from "@/helpers/formatDate";

describe("formatDate", () => {
  it("formats date with default format", () => {
    const date = "2024-03-20";
    const result = formatDate(date);
    expect(result).toBe("March 20, 2024");
  });

  it("formats date with custom format", () => {
    const date = "2024-03-20";
    const customFormat = "DD/MM/YYYY";
    const result = formatDate(date, customFormat);
    expect(result).toBe("20/03/2024");
  });

  it("handles different date inputs", () => {
    const date = "2024-03-20T15:30:00";
    const result = formatDate(date);
    expect(result).toBe("March 20, 2024");
  });
});
