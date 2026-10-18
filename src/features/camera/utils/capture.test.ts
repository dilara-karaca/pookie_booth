import { describe, expect, it } from "vitest";
import { coverCrop } from "./capture";

describe("coverCrop", () => {
  it("center-crops a widescreen frame into the booth ratio", () => {
    const crop = coverCrop(1920, 1080, 4 / 3);
    expect(crop.sy).toBe(0);
    expect(crop.sh).toBe(1080);
    expect(crop.sw / crop.sh).toBeCloseTo(4 / 3, 5);
    expect(crop.sx).toBeGreaterThan(0);
  });

  it("center-crops a tall frame without shifting horizontally", () => {
    const crop = coverCrop(1080, 1920, 4 / 3);
    expect(crop.sx).toBe(0);
    expect(crop.sw).toBe(1080);
    expect(crop.sw / crop.sh).toBeCloseTo(4 / 3, 5);
  });
});
