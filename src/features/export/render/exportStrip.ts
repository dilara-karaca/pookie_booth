import { getExportScale } from "@/features/frames/utils/layout";
import { drawStrip, type StripDrawInput } from "@/features/frames/utils/drawStrip";

export async function renderStripBlob(input: StripDrawInput): Promise<Blob> {
  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 2500)),
    ]);
  }

  const fullScale = getExportScale(input.layoutId);
  const blob = await renderAt(input, fullScale);
  if (blob) return blob;

  const smaller = await renderAt(input, fullScale * 0.72);
  if (smaller) return smaller;
  throw new Error("The photo strip couldn't be created. Try again.");
}

async function renderAt(input: StripDrawInput, scale: number): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  await drawStrip(canvas, input, scale);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
