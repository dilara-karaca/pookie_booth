import { describe, expect, it } from "vitest";
import { isPatternId } from "../utils/patterns";
import { categories, frameDesigns } from "./designs";

describe("frame designs", () => {
  it("keeps unique ids and drawable patterns in every category", () => {
    const ids = frameDesigns.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const category of categories) {
      expect(frameDesigns.some((item) => item.category === category.id)).toBe(true);
    }
    for (const item of frameDesigns) {
      expect(isPatternId(item.patternId)).toBe(true);
      expect(item.backgroundColor.startsWith("#")).toBe(true);
      expect(item.textColor.startsWith("#")).toBe(true);
    }
  });
});
