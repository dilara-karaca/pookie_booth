import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { FilterId } from "@/features/editor/filters/filters";
import type { FrameLayout } from "../types";
import { getLayoutMetrics } from "../utils/layout";
import { BASE_STRIP_WIDTH } from "../utils/layout";
import { drawStrip } from "../utils/drawStrip";

interface PhotostripProps {
  layoutId: FrameLayout;
  designId: string;
  photos: Array<string | null>;
  filterId: FilterId;
  caption: string;
  dateLabel: string;
  className?: string;
  density?: "preview" | "thumbnail";
  interactive?: boolean;
  onRetake?: (index: number) => void;
}

export function Photostrip({
  layoutId,
  designId,
  photos,
  filterId,
  caption,
  dateLabel,
  className,
  density = "preview",
  interactive = false,
  onRetake,
}: PhotostripProps) {
  const { copy } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelId = useId();
  const [revealed, setRevealed] = useState<number | null>(null);
  const metrics = getLayoutMetrics(layoutId, 1);
  const photoKey = photos.join("|");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let frame = 0;
    let active = true;
    let token = 0;

    const render = () => {
      const cssWidth = wrap.clientWidth;
      if (cssWidth < 8) return;
      const dpr = density === "thumbnail" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const scale = (cssWidth * dpr) / BASE_STRIP_WIDTH;
      const current = ++token;
      void (async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        if (!active || current !== token) return;
        await drawStrip(
          canvas,
          { layoutId, designId, photos, filterId, caption, dateLabel },
          scale,
          () => active && current === token,
        );
      })();
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(wrap);
    document.fonts?.addEventListener("loadingdone", schedule);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", schedule);
    };
  }, [layoutId, designId, photoKey, filterId, caption, dateLabel, density]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      style={{ aspectRatio: `${metrics.width} / ${metrics.height}` }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-labelledby={labelId}
        className="absolute inset-0 h-full w-full"
        style={{ filter: "drop-shadow(6px 10px 0 rgba(64,53,75,0.16))" }}
      />
      <span id={labelId} className="sr-only">
        {copy.strip(metrics.slots.length, dateLabel, caption)}
      </span>
      {interactive
        ? metrics.slots.map((slot, index) =>
            photos[index] ? (
              <div
                key={slot.x + "-" + index}
                className={cn("retake-slot absolute", revealed === index && "is-revealed")}
                style={{
                  left: `${(slot.x / metrics.width) * 100}%`,
                  top: `${(slot.y / metrics.height) * 100}%`,
                  width: `${(slot.width / metrics.width) * 100}%`,
                  height: `${(slot.height / metrics.height) * 100}%`,
                }}
                onClick={() => setRevealed((current) => (current === index ? null : index))}
              >
                <div className="retake-shade pointer-events-none absolute inset-0 bg-ink/30" />
                <button
                  type="button"
                  className="retake-btn absolute top-[7%] right-[6%] inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full border-2 border-cream bg-ink px-2 text-sm font-bold text-cream"
                  aria-label={copy.editor.retakePhoto(index + 1)}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRetake?.(index);
                  }}
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  <span className="pr-1">{copy.editor.retake}</span>
                </button>
              </div>
            ) : null,
          )
        : null}
    </div>
  );
}

export function StripFit({
  layoutId,
  maxVh = 68,
  maxWidth = 420,
  className,
  children,
}: {
  layoutId: FrameLayout;
  maxVh?: number;
  maxWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  const metrics = getLayoutMetrics(layoutId, 1);
  const ratio = metrics.width / metrics.height;
  return (
    <div
      className={cn("mx-auto w-full", className)}
      style={{ width: `min(100%, ${maxWidth}px, calc(${maxVh}vh * ${ratio}))` }}
    >
      {children}
    </div>
  );
}
