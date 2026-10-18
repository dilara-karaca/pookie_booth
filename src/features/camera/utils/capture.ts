export interface CoverCrop {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function coverCrop(sourceWidth: number, sourceHeight: number, aspect: number): CoverCrop {
  const sourceAspect = sourceWidth / sourceHeight;
  if (sourceAspect > aspect) {
    const sw = sourceHeight * aspect;
    return { sx: (sourceWidth - sw) / 2, sy: 0, sw, sh: sourceHeight };
  }
  const sh = sourceWidth / aspect;
  return { sx: 0, sy: (sourceHeight - sh) / 2, sw: sourceWidth, sh };
}

export function captureFrame(
  video: HTMLVideoElement,
  aspect: number,
  mirror: boolean,
): string {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error("not-ready");
  }

  const crop = coverCrop(video.videoWidth, video.videoHeight, aspect);
  const outputWidth = 1600;
  const outputHeight = Math.round(outputWidth / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no-canvas");

  if (mirror) {
    ctx.translate(outputWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, outputWidth, outputHeight);
  return canvas.toDataURL("image/jpeg", 0.92);
}
