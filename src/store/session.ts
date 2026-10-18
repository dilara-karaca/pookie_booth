import { create } from "zustand";
import { releaseImages } from "@/features/frames/utils/drawStrip";
import { getLayout, isFrameLayout } from "@/features/frames/utils/layout";
import type { FrameLayout, PhotoSlot } from "@/features/frames/types";
import { getFilter, type FilterId } from "@/features/editor/filters/filters";
import { sanitizeCaption } from "@/lib/dateStamp";

interface SessionState {
  layoutId: FrameLayout | null;
  frameDesignId: string | null;
  photos: Array<PhotoSlot | null>;
  selectedFilter: FilterId;
  customText: string;
  capturedAt: string | null;
  retakeIndex: number | null;
  selectLayout: (layoutId: FrameLayout) => void;
  selectDesign: (designId: string) => void;
  commitCapture: (index: number, dataUrl: string) => void;
  setFilter: (filterId: FilterId) => void;
  setCustomText: (value: string) => void;
  beginRetake: (index: number) => void;
  cancelRetake: () => void;
  resetSession: () => void;
}

function emptyPhotos(layoutId: FrameLayout): Array<PhotoSlot | null> {
  return Array.from({ length: getLayout(layoutId).photoCount }, () => null);
}

const initial = {
  layoutId: null as FrameLayout | null,
  frameDesignId: null as string | null,
  photos: [] as Array<PhotoSlot | null>,
  selectedFilter: "original" as FilterId,
  customText: "",
  capturedAt: null as string | null,
  retakeIndex: null as number | null,
};

export const useSession = create<SessionState>((set, get) => ({
  ...initial,
  selectLayout: (layoutId) => {
    const current = get();
    if (current.layoutId === layoutId) return;
    releaseImages(current.photos.map((photo) => photo?.dataUrl ?? null));
    set({
      layoutId,
      photos: emptyPhotos(layoutId),
      capturedAt: null,
      retakeIndex: null,
    });
  },
  selectDesign: (designId) => set({ frameDesignId: designId }),
  commitCapture: (index, dataUrl) => {
    const current = get();
    const photos = current.photos.slice();
    if (index < 0 || index >= photos.length) return;
    const previous = photos[index];
    if (previous) releaseImages([previous.dataUrl]);
    photos[index] = { id: crypto.randomUUID(), dataUrl };
    const complete = photos.every(Boolean);
    const stamp =
      complete && current.retakeIndex === null && current.capturedAt === null
        ? new Date().toISOString()
        : current.capturedAt;
    set({ photos, capturedAt: stamp, retakeIndex: null });
  },
  setFilter: (filterId) => set({ selectedFilter: getFilter(filterId).id }),
  setCustomText: (value) => set({ customText: sanitizeCaption(value) }),
  beginRetake: (index) => {
    const photos = get().photos;
    if (!photos[index]) return;
    set({ retakeIndex: index });
  },
  cancelRetake: () => set({ retakeIndex: null }),
  resetSession: () => {
    releaseImages(get().photos.map((photo) => photo?.dataUrl ?? null));
    set({ ...initial, photos: [] });
  },
}));

export function hasAnyPhoto(photos: Array<PhotoSlot | null>): boolean {
  return photos.some(Boolean);
}

export function isShootComplete(photos: Array<PhotoSlot | null>): boolean {
  return photos.length > 0 && photos.every(Boolean);
}

export function readLayoutParam(value: string | null): FrameLayout | null {
  if (!value || !isFrameLayout(value)) return null;
  return value;
}
