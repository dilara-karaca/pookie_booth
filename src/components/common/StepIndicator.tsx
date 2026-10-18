import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

const hrefs = ["/frames", "/camera", "/editor", "/result"] as const;

export function StepIndicator({ pathname }: { pathname: string }) {
  const { copy } = useI18n();
  const labels = [copy.steps.frame, copy.steps.camera, copy.steps.edit, copy.steps.save];
  const current = hrefs.findIndex((href) => pathname.startsWith(href));
  if (current < 0) return null;

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label={copy.steps.group}>
      {hrefs.map((href, index) => {
        const state = index === current ? "current" : index < current ? "done" : "upcoming";
        const className = cn(
          "rounded-full border-2 px-3 py-1 font-display text-sm font-semibold",
          state === "current" && "border-ink bg-butter text-ink",
          state === "done" && "border-ink bg-white text-ink",
          state === "upcoming" && "border-ink/20 bg-white/50 text-ink/50",
        );
        const label = `${index + 1}. ${labels[index]}`;
        return (
          <li key={href} className="flex items-center gap-2">
            {state === "upcoming" ? (
              <span className={className}>{label}</span>
            ) : (
              <Link to={href} className={className} aria-current={state === "current" ? "step" : undefined}>
                {label}
              </Link>
            )}
            {index < hrefs.length - 1 ? <span aria-hidden className="text-ink/30">→</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
