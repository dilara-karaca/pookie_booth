import { motion, useReducedMotion } from "motion/react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  const reduce = useReducedMotion();
  if (!message) return null;
  return (
    <motion.div
      role="status"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 rounded-full border-2 border-ink bg-ink px-5 py-3 text-center font-display text-cream shadow-[4px_4px_0_#FF8FAB]"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.35, duration: 0.4 }}
    >
      {message}
    </motion.div>
  );
}
