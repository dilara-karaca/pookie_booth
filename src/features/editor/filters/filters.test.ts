import { describe, expect, it } from "vitest";
import { FILTERS, getFilter, isFilterId } from "./filters";

describe("filters", () => {
  it("includes the first-version set and a passthrough original", () => {
    expect(FILTERS.map((filter) => filter.id)).toEqual([
      "original",
      "bw",
      "vintage",
      "soft-pink",
      "film",
      "dreamy",
    ]);
    expect(getFilter("vintage").css).toContain("sepia");
    expect(getFilter("nope").id).toBe("original");
    expect(isFilterId("film")).toBe(true);
  });
});
