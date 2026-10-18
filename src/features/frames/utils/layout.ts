import type { FrameLayout, LayoutDefinition, StripMetrics } from "../types";

export const BASE_STRIP_WIDTH = 720;
export const MAX_EXPORT_EDGE = 4096;
export const PHOTO_ASPECT = 4 / 3;

const PADDING_X = 52;
const PADDING_TOP = 48;
const GAP = 18;
const FOOTER_HEIGHT = 124;
const FOOTER_GAP = 14;

export const layouts: Record<FrameLayout, LayoutDefinition> = {
  "vertical-2": {
    id: "vertical-2",
    name: "Vertical 2",
    description: "Two photos, stacked",
    photoCount: 2,
    columns: 1,
    rows: 2,
  },
  "vertical-3": {
    id: "vertical-3",
    name: "Vertical 3",
    description: "Three photos, stacked",
    photoCount: 3,
    columns: 1,
    rows: 3,
  },
  "vertical-4": {
    id: "vertical-4",
    name: "Vertical 4",
    description: "The classic four-cut",
    photoCount: 4,
    columns: 1,
    rows: 4,
  },
  "grid-4": {
    id: "grid-4",
    name: "Grid 4",
    description: "A 2×2 collage",
    photoCount: 4,
    columns: 2,
    rows: 2,
  },
  "grid-6": {
    id: "grid-6",
    name: "Grid 6",
    description: "A 2×3 collage",
    photoCount: 6,
    columns: 2,
    rows: 3,
  },
};

export const layoutList: LayoutDefinition[] = [
  layouts["vertical-2"],
  layouts["vertical-3"],
  layouts["vertical-4"],
  layouts["grid-4"],
  layouts["grid-6"],
];

export function isFrameLayout(value: string): value is FrameLayout {
  return value in layouts;
}

export function getLayout(id: FrameLayout): LayoutDefinition {
  return layouts[id];
}

export function getLayoutMetrics(layoutId: FrameLayout, scale = 1): StripMetrics {
  const layout = layouts[layoutId];
  const width = BASE_STRIP_WIDTH * scale;
  const paddingX = PADDING_X * scale;
  const paddingTop = PADDING_TOP * scale;
  const gap = GAP * scale;
  const footerHeight = FOOTER_HEIGHT * scale;
  const footerGap = FOOTER_GAP * scale;
  const photoRadius = 18 * scale;
  const outerRadius = 32 * scale;

  const innerWidth = width - paddingX * 2;
  const photoWidth =
    layout.columns === 1 ? innerWidth : (innerWidth - gap * (layout.columns - 1)) / layout.columns;
  const photoHeight = photoWidth / PHOTO_ASPECT;

  const slots = [];
  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      slots.push({
        x: paddingX + column * (photoWidth + gap),
        y: paddingTop + row * (photoHeight + gap),
        width: photoWidth,
        height: photoHeight,
      });
    }
  }

  const gridHeight = layout.rows * photoHeight + (layout.rows - 1) * gap;
  const footerTop = paddingTop + gridHeight + footerGap;
  const height = footerTop + footerHeight;

  return {
    width,
    height,
    paddingX,
    paddingTop,
    gap,
    footerHeight,
    footerTop,
    photoRadius,
    outerRadius,
    photoAspect: PHOTO_ASPECT,
    slots,
  };
}

export function getExportScale(layoutId: FrameLayout): number {
  const base = getLayoutMetrics(layoutId, 1);
  const longest = Math.max(base.width, base.height);
  return MAX_EXPORT_EDGE / longest;
}
