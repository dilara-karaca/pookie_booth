import { FILTERS, type FilterId } from "../filters/filters";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";

interface FilterPickerProps {
  value: FilterId;
  previewUrl: string | null;
  onChange: (filterId: FilterId) => void;
}

export function FilterPicker({ value, previewUrl, onChange }: FilterPickerProps) {
  const { copy } = useI18n();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">{copy.editor.filters}</h2>
      <p className="mt-1 text-sm text-ink/75">{copy.editor.filtersHint}</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {FILTERS.map((filter) => {
          const selected = filter.id === value;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(filter.id)}
              className={cn(
                "rounded-2xl border-2 border-ink p-1 text-left shadow-[3px_3px_0_#40354B]",
                selected ? "selected-pop bg-butter" : "bg-white",
              )}
            >
              <span className="block overflow-hidden rounded-xl bg-softpink">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                    style={{ filter: filter.css === "none" ? undefined : filter.css }}
                  />
                ) : (
                  <span
                    className="block aspect-[4/3] w-full bg-gradient-to-br from-sky via-softpink to-butter"
                    style={{ filter: filter.css === "none" ? undefined : filter.css }}
                  />
                )}
              </span>
              <span className="block px-1 py-2 text-center font-display text-sm font-semibold leading-tight">
                {copy.filters[filter.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
