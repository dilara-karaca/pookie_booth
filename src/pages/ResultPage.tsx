import { Download, RotateCcw, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, buttonClass } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Toast } from "@/components/common/Toast";
import { Floaters } from "@/components/decorations/Decor";
import { downloadBlob } from "@/features/export/download/download";
import { renderStripBlob } from "@/features/export/render/exportStrip";
import { shareStrip } from "@/features/export/share/share";
import { Photostrip, StripFit } from "@/features/frames/components/Photostrip";
import { formatBoothStamp } from "@/lib/dateStamp";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { usePageTitle } from "@/hooks/usePageTitle";
import { isShootComplete, useSession } from "@/store/session";

export function ResultPage() {
  const { copy } = useI18n();
  usePageTitle(copy.pages.result);
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const layoutId = useSession((state) => state.layoutId);
  const designId = useSession((state) => state.frameDesignId);
  const photos = useSession((state) => state.photos);
  const filterId = useSession((state) => state.selectedFilter);
  const customText = useSession((state) => state.customText);
  const capturedAt = useSession((state) => state.capturedAt);
  const resetSession = useSession((state) => state.resetSession);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const stamp = useMemo(() => (capturedAt ? formatBoothStamp(new Date(capturedAt)) : null), [capturedAt]);

  if (!layoutId || !designId) return <Navigate to="/frames" replace />;
  if (!isShootComplete(photos)) return <Navigate to="/camera" replace />;
  if (!stamp) return <Navigate to="/editor" replace />;

  const input = {
    layoutId,
    designId,
    photos: photos.map((photo) => photo?.dataUrl ?? null),
    filterId,
    caption: customText,
    dateLabel: stamp.label,
  };

  async function onDownload() {
    setBusy("download");
    setToast(null);
    try {
      const blob = await renderStripBlob(input);
      downloadBlob(blob, stamp?.filename ?? "photobooth.png");
      setToast(copy.result.saved);
    } catch {
      setToast(copy.result.downloadFailed);
    } finally {
      setBusy(null);
    }
  }

  async function onShare() {
    setBusy("share");
    setShareNote(null);
    try {
      const blob = await renderStripBlob(input);
      const result = await shareStrip(blob, stamp?.filename ?? "photobooth.png");
      if (result === "unsupported") {
        setShareNote(copy.result.shareUnsupported);
      } else if (result === "shared") {
        setToast(copy.result.shared);
      }
    } catch {
      setToast(copy.result.shareFailed);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <Floaters />
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <motion.h1
          className="font-display text-4xl font-bold sm:text-6xl"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {copy.result.line1}
          <span className="mt-1 block">{copy.result.line2}</span>
        </motion.h1>
        <motion.div
          className="mt-8"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
        >
          <StripFit layoutId={layoutId} maxVh={62} maxWidth={420}>
            <Photostrip {...input} />
          </StripFit>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.15, duration: 0.35 }}
        >
          <Button size="lg" variant="primary" disabled={busy !== null} onClick={() => void onDownload()}>
            <Download className="h-5 w-5" aria-hidden="true" />
            {busy === "download" ? copy.result.printing : copy.result.download}
          </Button>
          <Button size="lg" variant="sky" disabled={busy !== null} onClick={() => void onShare()}>
            <Share2 className="h-5 w-5" aria-hidden="true" />
            {busy === "share" ? copy.result.preparing : copy.result.share}
          </Button>
        </motion.div>
        {shareNote ? <p className="mx-auto mt-4 max-w-md rounded-2xl bg-white px-4 py-3">{shareNote}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/editor" className={buttonClass("ghost", "md")}>
            {copy.result.back}
          </Link>
          <Button variant="sunny" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {copy.result.startOver}
          </Button>
        </div>
      </div>
      <Toast message={toast} />
      <ConfirmDialog
        open={confirmReset}
        title={copy.result.startTitle}
        body={copy.result.startBody}
        confirmLabel={copy.result.startConfirm}
        cancelLabel={copy.result.keep}
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetSession();
          setConfirmReset(false);
          navigate("/frames");
        }}
      />
    </div>
  );
}
