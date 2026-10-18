interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 rounded-full border-2 border-ink bg-ink px-5 py-3 text-center font-display text-cream shadow-[4px_4px_0_#FF8FAB]"
    >
      {message}
    </div>
  );
}
