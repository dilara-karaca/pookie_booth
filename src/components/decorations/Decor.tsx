import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StarDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.2 14.5 8l7 .4-5.4 4.4 1.8 6.8L12 16.2 6.1 19.6 7.9 12.8 2.5 8.4 9.5 8 12 1.2Z"
      />
    </svg>
  );
}

export function HeartDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 20.4C7.4 16.8 3 13.4 3 8.9 3 6 5.2 4 8 4c1.7 0 3.1.8 4 2.1C12.9 4.8 14.3 4 16 4c2.8 0 5 2 5 4.9 0 4.5-4.4 7.9-9 11.5Z"
      />
    </svg>
  );
}

export function Floaters({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <StarDecor className="floaty absolute left-[6%] top-[12%] h-8 w-8 text-butter" />
      <HeartDecor className="floaty absolute right-[8%] top-[18%] h-7 w-7 text-coral [--spin:12deg]" />
      <StarDecor className="floaty absolute bottom-[14%] left-[12%] h-5 w-5 text-sky [animation-delay:400ms]" />
      <HeartDecor className="floaty absolute right-[16%] bottom-[18%] h-6 w-6 text-lavender [--spin:-8deg]" />
      {children}
    </div>
  );
}
