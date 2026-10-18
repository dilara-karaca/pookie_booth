import { ArrowLeft, SwitchCamera } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Photostrip } from "@/features/frames/components/Photostrip";
import { useCamera, type FacingMode } from "@/features/camera/hooks/useCamera";
import { captureFrame } from "@/features/camera/utils/capture";
import { getLayout, PHOTO_ASPECT } from "@/features/frames/utils/layout";
import { formatBoothStamp } from "@/lib/dateStamp";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSession } from "@/store/session";

export function CameraPage() {
  const { copy } = useI18n();
  usePageTitle(copy.pages.camera);
  const navigate = useNavigate();
  const layoutId = useSession((state) => state.layoutId);
  const designId = useSession((state) => state.frameDesignId);
  const photos = useSession((state) => state.photos);
  const retakeIndex = useSession((state) => state.retakeIndex);
  const filterId = useSession((state) => state.selectedFilter);
  const customText = useSession((state) => state.customText);
  const capturedAt = useSession((state) => state.capturedAt);
  const commitCapture = useSession((state) => state.commitCapture);
  const cancelRetake = useSession((state) => state.cancelRetake);

  const [armed, setArmed] = useState(false);
  const [facing, setFacing] = useState<FacingMode>("user");
  const [retryToken, setRetryToken] = useState(0);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [holding, setHolding] = useState(false);
  const [captureCode, setCaptureCode] = useState<"not-ready" | "no-canvas" | "failed" | null>(null);
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const { videoRef, status, error, canFlip } = useCamera(armed, facing, retryToken);

  const shoot = useCallback(() => {
    if (busyRef.current || status !== "ready" || !videoRef.current || !layoutId) return;
    const index = retakeIndex ?? photos.findIndex((photo) => photo === null);
    if (index < 0) return;
    try {
      const dataUrl = captureFrame(videoRef.current, PHOTO_ASPECT, facing === "user");
      const wasRetake = retakeIndex !== null;
      const willFinish = wasRetake || photos.every((photo, photoIndex) => photo !== null || photoIndex === index);
      busyRef.current = true;
      setCaptureCode(null);
      setFlash(true);
      setBusy(true);
      if (willFinish) setHolding(true);
      commitCapture(index, dataUrl);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setFlash(false);
        setBusy(false);
        busyRef.current = false;
        if (willFinish) navigate("/editor", { replace: true });
      }, 280);
    } catch (caught) {
      busyRef.current = false;
      setBusy(false);
      const message = caught instanceof Error ? caught.message : "";
      setCaptureCode(message === "not-ready" ? "not-ready" : message === "no-canvas" ? "no-canvas" : "failed");
    }
  }, [commitCapture, facing, layoutId, navigate, photos, retakeIndex, status, videoRef]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(target.tagName)) return;
      event.preventDefault();
      shoot();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shoot]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const captureError =
    captureCode === "not-ready"
      ? copy.camera.notReady
      : captureCode === "no-canvas"
        ? copy.camera.noCanvas
        : captureCode === "failed"
          ? copy.camera.captureFailed
          : null;

  if (!layoutId || !designId) return <Navigate to="/frames" replace />;

  const total = photos.length;
  const index = retakeIndex ?? photos.findIndex((photo) => photo === null);
  if (index < 0 && !holding) return <Navigate to="/editor" replace />;

  const displayIndex = index < 0 ? total : index + 1;
  const dateLabel = capturedAt ? formatBoothStamp(new Date(capturedAt)).label : formatBoothStamp(new Date()).label;

  function goBack() {
    if (retakeIndex !== null) {
      cancelRetake();
      navigate("/editor");
      return;
    }
    navigate("/frames");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.camera.back}
        </Button>
        <p className="font-display text-2xl font-bold sm:text-3xl" aria-live="polite">
          {retakeIndex !== null ? copy.camera.retakeOf(displayIndex, total) : copy.camera.photoOf(displayIndex, total)}
        </p>
        <p className="rounded-full bg-white px-3 py-1 font-display text-sm font-semibold">{copy.designs[designId]}</p>
      </div>

      {!armed ? (
        <section className="bg-skywash rounded-[2rem] border-2 border-ink px-6 py-12 text-center shadow-[8px_8px_0_#A2D2FF]">
          <p className="font-display text-4xl font-bold sm:text-5xl">{copy.camera.ready}</p>
          <p className="mx-auto mt-3 max-w-lg text-lg">{copy.camera.readyBody(getLayout(layoutId).photoCount)}</p>
          <Button size="lg" className="mt-6" onClick={() => setArmed(true)}>
            {copy.camera.open}
          </Button>
        </section>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-ink shadow-[8px_8px_0_#40354B]">
              <div className="relative" style={{ aspectRatio: `${PHOTO_ASPECT}` }}>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={cn("h-full w-full object-cover", facing === "user" && "-scale-x-100")}
                />
                {flash ? <div className="flash-overlay pointer-events-none absolute inset-0 bg-white" /> : null}
                {status !== "ready" ? (
                  <div className="absolute inset-0 grid place-items-center bg-ink/75 p-6 text-center text-cream">
                    <div>
                      <p className="font-display text-3xl font-bold">{status === "error" ? copy.camera.paused : copy.camera.opening}</p>
                      {error ? <p className="mt-3 text-lg">{copy.camera.errors[error]}</p> : null}
                      {status === "error" ? (
                        <Button className="mt-5" variant="sunny" onClick={() => setRetryToken((value) => value + 1)}>
                          {copy.camera.retry}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {captureError ? (
              <p role="alert" className="mt-3 rounded-2xl bg-softpink px-4 py-3">
                {captureError}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-center gap-4">
              {canFlip ? (
                <Button
                  variant="ghost"
                  aria-label={facing === "user" ? copy.camera.flipBack : copy.camera.flipFront}
                  onClick={() => setFacing((current) => (current === "user" ? "environment" : "user"))}
                >
                  <SwitchCamera className="h-5 w-5" aria-hidden="true" />
                  {copy.camera.flip}
                </Button>
              ) : (
                <span className="w-24" />
              )}
              <button
                type="button"
                className="grid h-20 w-20 place-items-center rounded-full border-4 border-ink bg-coral shadow-[4px_4px_0_#40354B] disabled:opacity-50"
                aria-label={retakeIndex !== null ? copy.camera.retake(displayIndex) : copy.camera.take(displayIndex)}
                disabled={status !== "ready" || busy}
                onClick={shoot}
              >
                <span className="h-12 w-12 rounded-full border-4 border-white bg-cream" />
              </button>
              <p className="hidden w-24 text-sm text-ink/70 sm:block">{copy.camera.space}</p>
            </div>
          </div>

          <div className="hidden lg:block">
            <Photostrip
              layoutId={layoutId}
              designId={designId}
              photos={photos.map((photo) => photo?.dataUrl ?? null)}
              filterId={filterId}
              caption={customText}
              dateLabel={dateLabel}
              density="thumbnail"
            />
          </div>
        </div>
      )}

      <ol className="flex flex-wrap justify-center gap-2" aria-label={copy.camera.shots}>
        {photos.map((photo, photoIndex) => (
          <li
            key={photo?.id ?? `empty-${photoIndex}`}
            className={cn(
              "w-20 overflow-hidden rounded-2xl border-2 border-ink bg-white sm:w-24",
              photoIndex === index && "ring-4 ring-butter",
            )}
          >
            {photo ? (
              <img src={photo.dataUrl} alt={copy.camera.photoAlt(photoIndex + 1)} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center font-display text-xl font-bold text-ink/40">{photoIndex + 1}</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
