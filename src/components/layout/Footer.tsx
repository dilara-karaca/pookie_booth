import { Heart } from "lucide-react";
import { brand } from "@/lib/brand";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export function Footer({ flush = false }: { flush?: boolean }) {
  const { copy } = useI18n();

  return (
    <footer className={`${flush ? "" : "mt-16 "}border-t-2 border-ink/10 bg-white/50`}>
      <div className={`mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between ${flush ? "py-4" : "py-8"}`}>
        <p className="font-display text-xl font-bold">
          {brand.name} <Heart className="inline h-4 w-4 fill-coral text-coral" aria-hidden="true" />
        </p>
        <p className="max-w-md text-sm leading-relaxed text-ink/80">{copy.privacy}</p>
      </div>
    </footer>
  );
}
