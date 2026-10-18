import { describe, expect, it } from "vitest";
import { formatBoothStamp, MAX_CAPTION, sanitizeCaption } from "./dateStamp";

describe("formatBoothStamp", () => {
  it("formats the spec example from local date parts", () => {
    const stamp = formatBoothStamp(new Date(2026, 9, 18, 21, 53));
    expect(stamp.label).toBe("18.10.2026 · 21:53");
    expect(stamp.filename).toBe("photobooth-2026-10-18-2153.png");
  });
});

describe("sanitizeCaption", () => {
  it("collapses whitespace and caps characters, keeping emoji whole", () => {
    expect(sanitizeCaption("  Best   Day   ")).toBe("Best Day ");
    const caption = sanitizeCaption("Best Day Ever ♡ and more words");
    expect(Array.from(caption).length).toBe(MAX_CAPTION);
    expect(caption.startsWith("Best Day Ever ♡")).toBe(true);
  });
});
