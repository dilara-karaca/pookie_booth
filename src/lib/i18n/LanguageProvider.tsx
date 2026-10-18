import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { copyByLocale, DEFAULT_LOCALE, type Locale } from "./copy";

const STORAGE_KEY = "pookie-booth-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: (typeof copyByLocale)["tr"];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "tr" || stored === "en") return stored;
  } catch {
    // Private mode can block storage. Turkish stays the default.
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);
  const copy = copyByLocale[locale];

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice still applies for this visit.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.metaDescription);
  }, [locale, copy]);

  const value = useMemo(() => ({ locale, setLocale, copy }), [locale, setLocale, copy]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used within LanguageProvider");
  return value;
}
