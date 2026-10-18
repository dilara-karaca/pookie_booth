import { getFilter } from "@/features/editor/filters/filters";
import type { FilterId } from "@/features/editor/filters/filters";
import type { FrameLayout } from "../types";
import { getDesign } from "../data/designs";
import { getLayoutMetrics } from "./layout";
import { paintPattern, roundRect } from "./patterns";

export interface StripDrawInput {
  layoutId: FrameLayout;
  designId: string;
  photos: Array<string | null>;
  filterId: FilterId;
  caption: string;
  dateLabel: string;
}

const imageCache = new Map<string, HTMLImageElement>();
const filteredCache = new Map<string, HTMLCanvasElement>();

export function releaseImage(src: string): void {
  imageCache.delete(src);
  for (const key of filteredCache.keys()) {
    if (key.endsWith(`:${src}`)) filteredCache.delete(key);
  }
}

export function releaseImages(sources: Array<string | null>): void {
  for (const source of sources) {
    if (source) releaseImage(source);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      imageCache.set(src, image);
      resolve(image);
    };
    image.onerror = () => reject(new Error("Could not read a photo."));
    image.src = src;
  });
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return 0.299 * red + 0.587 * green + 0.114 * blue;
}

export async function drawStrip(
  canvas: HTMLCanvasElement,
  input: StripDrawInput,
  scale: number,
  isCurrent: () => boolean = () => true,
): Promise<void> {
  const images = await Promise.all(
    input.photos.map(async (photo) => {
      if (!photo) return null;
      try {
        return await loadImage(photo);
      } catch {
        return null;
      }
    }),
  );
  if (!isCurrent()) return;

  const metrics = getLayoutMetrics(input.layoutId, scale);
  const width = Math.round(metrics.width);
  const height = Math.round(metrics.height);
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");

  const design = getDesign(input.designId);
  const filter = getFilter(input.filterId);
  const dark = luminance(design.backgroundColor) < 150;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  roundRect(ctx, 0, 0, width, height, metrics.outerRadius);
  ctx.clip();

  ctx.fillStyle = design.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  paintPattern(ctx, design, width, height, scale);

  ctx.fillStyle = design.backgroundColor;
  ctx.fillRect(0, metrics.footerTop, width, height - metrics.footerTop);
  if (design.patternId !== "solid") {
    ctx.globalAlpha = dark ? 0.45 : 0.35;
    ctx.fillStyle = design.accentColor;
    ctx.fillRect(metrics.paddingX, metrics.footerTop, width - metrics.paddingX * 2, Math.max(2, 3 * scale));
    ctx.globalAlpha = 1;
  }

  metrics.slots.forEach((slot, index) => {
    const image = images[index];
    ctx.save();
    roundRect(ctx, slot.x, slot.y, slot.width, slot.height, metrics.photoRadius);
    ctx.clip();

    if (image) {
      const source = filter.id === "original" || canvasFiltersWork(ctx) ? image : filteredImage(image, filter.id);
      if (filter.id !== "original" && canvasFiltersWork(ctx)) ctx.filter = filter.css;
      drawCover(ctx, source, slot.x, slot.y, slot.width, slot.height);
      ctx.filter = "none";
    } else {
      ctx.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(64,53,75,0.08)";
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      ctx.fillStyle = design.textColor;
      ctx.globalAlpha = 0.55;
      ctx.font = `700 ${Math.max(18, slot.height * 0.16)}px Fredoka, Nunito, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), slot.x + slot.width / 2, slot.y + slot.height / 2);
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    ctx.save();
    roundRect(ctx, slot.x, slot.y, slot.width, slot.height, metrics.photoRadius);
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.8)";
    ctx.lineWidth = Math.max(1, 3 * scale);
    ctx.stroke();
    ctx.restore();
  });

  drawFooterText(ctx, input.caption, input.dateLabel, design.textColor, metrics, scale);
  ctx.restore();

  ctx.save();
  roundRect(ctx, 1, 1, width - 2, height - 2, metrics.outerRadius);
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(64,53,75,0.16)";
  ctx.lineWidth = Math.max(2, 3 * scale);
  ctx.stroke();
  ctx.restore();
}

let filterSupport: boolean | null = null;

function canvasFiltersWork(ctx: CanvasRenderingContext2D): boolean {
  if (filterSupport !== null) return filterSupport;
  if (!("filter" in ctx)) {
    filterSupport = false;
    return false;
  }
  ctx.filter = "grayscale(1)";
  filterSupport = ctx.filter === "grayscale(1)";
  ctx.filter = "none";
  return filterSupport;
}

function filteredImage(image: HTMLImageElement, filterId: FilterId): HTMLCanvasElement {
  const key = `${filterId}:${image.src}`;
  const cached = filteredCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;
  for (let index = 0; index < data.length; index += 4) {
    const next = applyFilterPixel(data[index], data[index + 1], data[index + 2], filterId);
    data[index] = next[0];
    data[index + 1] = next[1];
    data[index + 2] = next[2];
  }
  ctx.putImageData(pixels, 0, 0);
  filteredCache.set(key, canvas);
  if (filteredCache.size > 10) {
    const oldest = filteredCache.keys().next().value;
    if (oldest) filteredCache.delete(oldest);
  }
  return canvas;
}

function applyFilterPixel(r: number, g: number, b: number, filterId: FilterId): [number, number, number] {
  if (filterId === "bw") {
    const tone = clampByte(0.299 * r + 0.587 * g + 0.114 * b);
    return [tone, tone, tone];
  }
  if (filterId === "vintage") {
    const sr = r * 0.393 + g * 0.769 + b * 0.189;
    const sg = r * 0.349 + g * 0.686 + b * 0.168;
    const sb = r * 0.272 + g * 0.534 + b * 0.131;
    let rr = mix(r, sr, 0.55);
    let gg = mix(g, sg, 0.55);
    let bb = mix(b, sb, 0.55);
    [rr, gg, bb] = contrast(rr, gg, bb, 1.08);
    [rr, gg, bb] = saturate(rr, gg, bb, 0.8);
    return [clampByte(rr * 1.06), clampByte(gg * 1.06), clampByte(bb * 1.06)];
  }
  if (filterId === "soft-pink") {
    let rr = mix(r, r * 0.393 + g * 0.769 + b * 0.189, 0.28);
    let gg = mix(g, r * 0.349 + g * 0.686 + b * 0.168, 0.28);
    let bb = mix(b, r * 0.272 + g * 0.534 + b * 0.131, 0.28);
    [rr, gg, bb] = saturate(rr, gg, bb, 1.35);
    const rotated = hueRotate(rr, gg, bb, -18);
    return rotated.map((channel) => clampByte(channel * 1.06)) as [number, number, number];
  }
  if (filterId === "film") {
    let [rr, gg, bb] = contrast(r, g, b, 1.16);
    [rr, gg, bb] = saturate(rr, gg, bb, 0.72);
    rr = mix(rr, rr * 0.393 + gg * 0.769 + bb * 0.189, 0.2);
    gg = mix(gg, rr * 0.349 + gg * 0.686 + bb * 0.168, 0.2);
    bb = mix(bb, rr * 0.272 + gg * 0.534 + bb * 0.131, 0.2);
    return [clampByte(rr * 0.97), clampByte(gg * 0.97), clampByte(bb * 0.97)];
  }
  const [rr, gg, bb] = contrast(r * 1.12, g * 1.12, b * 1.12, 0.9);
  const dreamy = saturate(rr, gg, bb, 1.22);
  return [clampByte(dreamy[0]), clampByte(dreamy[1]), clampByte(dreamy[2])];
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, value));
}

function contrast(r: number, g: number, b: number, amount: number): [number, number, number] {
  return [(r - 128) * amount + 128, (g - 128) * amount + 128, (b - 128) * amount + 128];
}

function saturate(r: number, g: number, b: number, amount: number): [number, number, number] {
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return [luma + (r - luma) * amount, luma + (g - luma) * amount, luma + (b - luma) * amount];
}

function hueRotate(r: number, g: number, b: number, degrees: number): [number, number, number] {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    r * (0.213 + cos * 0.787 - sin * 0.213) +
      g * (0.715 - cos * 0.715 - sin * 0.715) +
      b * (0.072 - cos * 0.072 + sin * 0.928),
    r * (0.213 - cos * 0.213 + sin * 0.143) +
      g * (0.715 + cos * 0.285 + sin * 0.14) +
      b * (0.072 - cos * 0.072 - sin * 0.283),
    r * (0.213 - cos * 0.213 - sin * 0.787) +
      g * (0.715 - cos * 0.715 + sin * 0.715) +
      b * (0.072 + cos * 0.928 + sin * 0.072),
  ];
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const sourceWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const sourceHeight = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceAspect > targetAspect) {
    sw = sourceHeight * targetAspect;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetAspect;
    sy = (sourceHeight - sh) / 2;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawFooterText(
  ctx: CanvasRenderingContext2D,
  caption: string,
  dateLabel: string,
  color: string,
  metrics: ReturnType<typeof getLayoutMetrics>,
  scale: number,
): void {
  const halo = luminance(color) > 160 ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.85)";
  const captionY = metrics.footerTop + metrics.footerHeight * 0.38;
  const dateY = metrics.footerTop + metrics.footerHeight * 0.74;
  const maxCaptionWidth = metrics.width - metrics.paddingX * 2;

  if (caption.trim()) {
    let fontSize = 34 * scale;
    const minSize = 18 * scale;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    do {
      ctx.font = `700 ${fontSize}px Fredoka, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      if (ctx.measureText(caption).width <= maxCaptionWidth || fontSize <= minSize) break;
      fontSize -= 1;
    } while (fontSize > minSize);

    strokeFill(ctx, caption, metrics.width / 2, captionY, color, halo, Math.max(3, 5 * scale));
  }

  ctx.font = `800 ${Math.max(12, 18 * scale)}px Nunito, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  strokeFill(
    ctx,
    dateLabel,
    metrics.width - metrics.paddingX * 0.72,
    dateY,
    color,
    halo,
    Math.max(2, 4 * scale),
  );
}

function strokeFill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  halo: string,
  width: number,
): void {
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = halo;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
