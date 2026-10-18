import { frameDesigns } from "@/features/frames/data/designs";
import { FILTERS } from "@/features/editor/filters/filters";
import { layoutList } from "@/features/frames/utils/layout";
import { describe, expect, it } from "vitest";
import { copyByLocale } from "./copy";

describe("copy", () => {
  it("translates every frame, layout, and filter in both languages", () => {
    for (const copy of Object.values(copyByLocale)) {
      for (const design of frameDesigns) {
        expect(copy.designs[design.id]?.length).toBeGreaterThan(0);
      }
      for (const layout of layoutList) {
        expect(copy.layouts[layout.id].name.length).toBeGreaterThan(0);
      }
      for (const filter of FILTERS) {
        expect(copy.filters[filter.id].length).toBeGreaterThan(0);
      }
    }
  });
});
