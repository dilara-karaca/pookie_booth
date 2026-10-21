import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { copy } = useI18n();
  const cancelText = cancelLabel ?? copy.leave.keep;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-ink/45 p-4"
      role="presentation"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-[2rem] border-2 border-ink bg-cream p-6 shadow-[8px_8px_0_#40354B]"
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.42 }}
      >
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-coral">{copy.kicker}</p>
        <h2 id="confirm-title" className="mt-1 font-display text-3xl font-bold">
          {title}
        </h2>
        <p className="mt-3 text-lg leading-snug">{body}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="coral" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
