import { describe, expect, it } from "vitest";
import { getExportScale, getLayoutMetrics, layoutList, MAX_EXPORT_EDGE } from "./layout";

describe("layout metrics", () => {
  it("builds every layout with the right slot count and a shared photo ratio", () => {
    for (const layout of layoutList) {
      const metrics = getLayoutMetrics(layout.id, 1);
      expect(metrics.slots).toHaveLength(layout.photoCount);

      for (const slot of metrics.slots) {
        expect(slot.x).toBeGreaterThanOrEqual(metrics.paddingX - 0.01);
        expect(slot.y).toBeGreaterThanOrEqual(metrics.paddingTop - 0.01);
        expect(slot.x + slot.width).toBeLessThanOrEqual(metrics.width - metrics.paddingX + 0.01);
        expect(slot.y + slot.height).toBeLessThanOrEqual(metrics.footerTop);
        expect(slot.width / slot.height).toBeCloseTo(metrics.photoAspect, 5);
      }

      const scale = getExportScale(layout.id);
      const exported = getLayoutMetrics(layout.id, scale);
      const longest = Math.max(exported.width, exported.height);
      expect(longest).toBeCloseTo(MAX_EXPORT_EDGE, 4);
      expect(Math.min(exported.width, exported.height)).toBeGreaterThan(1200);
    }
  });

  it("orders grid slots left-to-right, top-to-bottom", () => {
    const metrics = getLayoutMetrics("grid-6", 1);
    expect(metrics.slots[0].x).toBeLessThan(metrics.slots[1].x);
    expect(metrics.slots[0].y).toBe(metrics.slots[1].y);
    expect(metrics.slots[1].y).toBeLessThan(metrics.slots[2].y);
    expect(metrics.slots[3].y).toBeLessThan(metrics.slots[4].y);
    expect(metrics.slots[4].y).toBe(metrics.slots[5].y);
  });
});
