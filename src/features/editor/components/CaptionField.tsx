import { MAX_CAPTION } from "@/lib/dateStamp";
import { useI18n } from "@/lib/i18n/LanguageProvider";

interface CaptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionField({ value, onChange }: CaptionFieldProps) {
  const { copy } = useI18n();
  return (
    <div>
      <label htmlFor="caption" className="font-display text-2xl font-bold">
        {copy.editor.caption}
      </label>
      <p className="mt-1 text-sm text-ink/75">{copy.editor.captionHint}</p>
      <input
        id="caption"
        value={value}
        maxLength={MAX_CAPTION}
        placeholder={copy.editor.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border-2 border-ink bg-white px-4 py-3 font-display text-lg outline-none"
      />
      <p className="mt-2 text-right text-sm text-ink/70">
        {Array.from(value).length}/{MAX_CAPTION}
      </p>
    </div>
  );
}
