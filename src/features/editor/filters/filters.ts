export const FILTERS = [
  { id: "original", name: "Original", css: "none" },
  { id: "bw", name: "Black & White", css: "grayscale(1) contrast(1.05)" },
  { id: "vintage", name: "Vintage", css: "sepia(0.55) contrast(1.08) saturate(0.8) brightness(1.06)" },
  {
    id: "soft-pink",
    name: "Soft Pink",
    css: "sepia(0.28) saturate(1.35) hue-rotate(-18deg) brightness(1.06)",
  },
  { id: "film", name: "Film", css: "contrast(1.16) saturate(0.72) sepia(0.2) brightness(0.97)" },
  { id: "dreamy", name: "Dreamy", css: "brightness(1.12) contrast(0.9) saturate(1.22)" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export function isFilterId(value: string): value is FilterId {
  return FILTERS.some((filter) => filter.id === value);
}

export function getFilter(id: string): (typeof FILTERS)[number] {
  return FILTERS.find((filter) => filter.id === id) ?? FILTERS[0];
}
