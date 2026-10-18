import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-bubblegum text-ink",
  sunny: "bg-butter text-ink",
  sky: "bg-sky text-ink",
  mint: "bg-mint text-ink",
  coral: "bg-coral text-white",
  ink: "bg-ink text-cream",
  ghost: "bg-cream/80 text-ink",
} as const;

const sizes = {
  md: "min-h-11 px-4 text-base",
  lg: "min-h-14 px-6 text-lg",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink font-display font-semibold",
    "shadow-[4px_4px_0_#40354B] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#40354B]",
    "active:translate-y-0.5 active:shadow-[2px_2px_0_#40354B] disabled:pointer-events-none disabled:opacity-50",
    "touch-manipulation",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
