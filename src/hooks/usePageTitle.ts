import { useEffect } from "react";
import { brand } from "@/lib/brand";

export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${brand.name}` : brand.name;
  }, [title]);
}
