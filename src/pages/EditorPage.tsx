import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { buttonClass } from "@/components/common/Button";
import { CaptionField } from "@/features/editor/components/CaptionField";
import { FilterPicker } from "@/features/editor/components/FilterPicker";
import { Photostrip, StripFit } from "@/features/frames/components/Photostrip";
import { formatBoothStamp } from "@/lib/dateStamp";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { usePageTitle } from "@/hooks/usePageTitle";
import { isShootComplete, useSession } from "@/store/session";

export function EditorPage() {
  const { copy } = useI18n();
  usePageTitle(copy.pages.editor);
  const navigate = useNavigate();
  const layoutId = useSession((state) => state.layoutId);
  const designId = useSession((state) => state.frameDesignId);
  const photos = useSession((state) => state.photos);
  const filterId = useSession((state) => state.selectedFilter);
  const customText = useSession((state) => state.customText);
  const capturedAt = useSession((state) => state.capturedAt);
  const setFilter = useSession((state) => state.setFilter);
  const setCustomText = useSession((state) => state.setCustomText);
  const beginRetake = useSession((state) => state.beginRetake);

  useEffect(() => {
    const state = useSession.getState();
    if (isShootComplete(state.photos) && !state.capturedAt) {
      useSession.setState({ capturedAt: new Date().toISOString() });
    }
  }, [photos, capturedAt]);

  if (!layoutId || !designId) return <Navigate to="/frames" replace />;
  if (!isShootComplete(photos)) return <Navigate to="/camera" replace />;
  if (!capturedAt) return null;

  const stamp = formatBoothStamp(new Date(capturedAt));
  const urls = photos.map((photo) => photo?.dataUrl ?? null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-5xl font-bold">{copy.editor.heading}</h1>
          <p className="mt-2 text-lg">{copy.editor.intro}</p>
        </div>
        <Link to="/frames" className={buttonClass("ghost", "md")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.editor.changeFrame}
        </Link>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <StripFit layoutId={layoutId} maxVh={78} maxWidth={460}>
          <Photostrip
            layoutId={layoutId}
            designId={designId}
            photos={urls}
            filterId={filterId}
            caption={customText}
            dateLabel={stamp.label}
            interactive
            onRetake={(index) => {
              beginRetake(index);
              navigate("/camera");
            }}
          />
        </StripFit>

        <aside className="space-y-8 rounded-[2rem] border-2 border-ink bg-white/85 p-5 shadow-[6px_6px_0_#FFE66D]">
          <FilterPicker value={filterId} previewUrl={urls[0]} onChange={setFilter} />
          <CaptionField value={customText} onChange={setCustomText} />
          <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
            {copy.editor.printed} <span className="font-bold">{stamp.label}</span>
          </p>
          <button type="button" className={buttonClass("primary", "lg", "w-full")} onClick={() => navigate("/result")}>
            {copy.editor.finish}
          </button>
          <p className="text-sm text-ink/70">{copy.privacy}</p>
        </aside>
      </div>
    </div>
  );
}
