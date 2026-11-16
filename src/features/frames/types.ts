export type FrameLayout =
  | "vertical-2"
  | "vertical-3"
  | "vertical-4"
  | "grid-4"
  | "grid-6";

export type FrameCategory =
  | "classic"
  | "lovely"
  | "sweet"
  | "gingham"
  | "retro"
  | "special";

export type PatternId =
  | "solid"
  | "hearts"
  | "bows"
  | "love"
  | "strawberry"
  | "cherry"
  | "daisy"
  | "flowers"
  | "clouds"
  | "gingham"
  | "stripes"
  | "checkers"
  | "stars"
  | "night-stars"
  | "disco"
  | "groovy"
  | "shapes"
  | "y2k-hearts"
  | "birthday"
  | "valentine"
  | "christmas"
  | "newyear";

export interface FrameDesign {
  id: string;
  name: string;
  category: FrameCategory;
  backgroundColor: string;
  accentColor: string;
  patternColors: string[];
  patternId: PatternId;
  textColor: string;
}

export interface LayoutDefinition {
  id: FrameLayout;
  name: string;
  description: string;
  photoCount: number;
  columns: number;
  rows: number;
}

export interface PhotoSlot {
  id: string;
  dataUrl: string;
}

export interface SlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StripMetrics {
  width: number;
  height: number;
  paddingX: number;
  paddingTop: number;
  gap: number;
  footerHeight: number;
  footerTop: number;
  photoRadius: number;
  outerRadius: number;
  photoAspect: number;
  slots: SlotRect[];
}
