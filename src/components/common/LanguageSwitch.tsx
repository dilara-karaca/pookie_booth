import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/copy";

const options: Locale[] = ["tr", "en"];

export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale, copy } = useI18n();

  return (
    <div
      role="group"
      aria-label={copy.language.group}
      className={cn("inline-flex rounded-full border-2 border-ink bg-white p-0.5", className)}
    >
      {options.map((code) => {
        const selected = locale === code;
        const label = code === "tr" ? copy.language.tr : copy.language.en;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={selected}
            aria-label={label}
            onClick={() => setLocale(code)}
            className={cn(
              "rounded-full px-2.5 py-1 font-display text-sm font-semibold",
              selected ? "bg-butter" : "hover:bg-softpink",
            )}
          >
            <span aria-hidden="true" className="sm:hidden">
              {code === "tr" ? "TR" : "EN"}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
