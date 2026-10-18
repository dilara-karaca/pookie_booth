import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buttonClass } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Photostrip, StripFit } from "@/features/frames/components/Photostrip";
import { categories, designsByCategory, getDesign } from "@/features/frames/data/designs";
import type { FrameCategory, FrameLayout } from "@/features/frames/types";
import { getLayout, layoutList } from "@/features/frames/utils/layout";
import { formatBoothStamp } from "@/lib/dateStamp";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { usePageTitle } from "@/hooks/usePageTitle";
import { hasAnyPhoto, isShootComplete, useSession } from "@/store/session";

export function FrameSelectionPage() {
  const { copy } = useI18n();
  usePageTitle(copy.pages.frames);
  const layoutId = useSession((state) => state.layoutId);
  const designId = useSession((state) => state.frameDesignId);
  const photos = useSession((state) => state.photos);
  const filterId = useSession((state) => state.selectedFilter);
  const customText = useSession((state) => state.customText);
  const capturedAt = useSession((state) => state.capturedAt);
  const selectLayout = useSession((state) => state.selectLayout);
  const selectDesign = useSession((state) => state.selectDesign);
  const [pendingLayout, setPendingLayout] = useState<FrameLayout | null>(null);
  const [category, setCategory] = useState<FrameCategory>("lovely");

  useEffect(() => {
    if (!useSession.getState().layoutId) selectLayout("vertical-4");
    if (!useSession.getState().frameDesignId) selectDesign("lovely-pink-hearts");
  }, [selectDesign, selectLayout]);

  useEffect(() => {
    if (designId) setCategory(getDesign(designId).category);
  }, [designId]);

  const previewDate = useMemo(
    () => (capturedAt ? formatBoothStamp(new Date(capturedAt)).label : formatBoothStamp(new Date()).label),
    [capturedAt],
  );

  if (!layoutId || !designId) return null;

  const designs = designsByCategory(category);
  const complete = isShootComplete(photos);
  const nextHref = complete ? "/editor" : "/camera";

  function requestLayout(next: FrameLayout) {
    if (next === layoutId) return;
    if (hasAnyPhoto(photos)) {
      setPendingLayout(next);
      return;
    }
    selectLayout(next);
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-8">
      <h1 className="font-display text-5xl font-bold sm:text-6xl">{copy.frames.title}</h1>
      <p className="mt-3 max-w-2xl text-lg">{copy.frames.intro}</p>

      <section className="mt-8" aria-labelledby="layout-heading">
        <h2 id="layout-heading" className="font-display text-2xl font-bold">
          {copy.frames.layout}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {layoutList.map((layout) => {
            const selected = layout.id === layoutId;
            return (
              <button
                key={layout.id}
                type="button"
                aria-pressed={selected}
                onClick={() => requestLayout(layout.id)}
                className={cn(
                  "rounded-[1.5rem] border-2 border-ink p-3 text-left shadow-[4px_4px_0_#40354B]",
                  selected ? "selected-pop bg-butter" : "bg-white",
                )}
              >
                <LayoutGlyph columns={layout.columns} rows={layout.rows} />
                <span className="mt-3 block font-display text-lg font-bold">{copy.layouts[layout.id].name}</span>
                <span className="block text-sm">{copy.layouts[layout.id].description}</span>
                <span className="mt-1 block text-sm font-semibold">{copy.frames.photoCount(layout.photoCount)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0" aria-labelledby="design-heading">
          <h2 id="design-heading" className="font-display text-2xl font-bold">
            {copy.frames.design}
          </h2>
          <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2" role="tablist" aria-label={copy.frames.categories}>
            {categories.map((item) => {
              const selected = item.id === category;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "shrink-0 rounded-full border-2 border-ink px-4 py-2 font-display font-semibold",
                    selected ? "bg-lavender" : "bg-white",
                  )}
                >
                  {copy.categories[item.id].label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-ink/70">{copy.categories[category].blurb}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {designs.map((design) => {
              const selected = design.id === designId;
              return (
                <button
                  key={design.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectDesign(design.id)}
                  className={cn("rounded-[1.5rem] p-2 text-left", selected && "selected-pop bg-white ring-4 ring-coral")}
                >
                  <Photostrip
                    layoutId={layoutId}
                    designId={design.id}
                    photos={Array.from({ length: getLayout(layoutId).photoCount }, () => null)}
                    filterId="original"
                    caption=""
                    dateLabel={previewDate}
                    density="thumbnail"
                  />
                  <span className="mt-2 block text-center font-display font-semibold">{copy.designs[design.id]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="rounded-[2rem] border-2 border-ink bg-white/80 p-4 shadow-[6px_6px_0_#CDB4DB] lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-bold">{copy.designs[designId]}</h2>
          <p className="text-sm text-ink/70">{copy.layouts[layoutId].name}</p>
          <Link to={nextHref} className={buttonClass("primary", "lg", "mt-4 w-full")}>
            {complete ? copy.frames.backToEditor : copy.frames.shoot}
          </Link>
          <StripFit layoutId={layoutId} maxVh={52} maxWidth={260} className="mt-4">
            <Photostrip
              layoutId={layoutId}
              designId={designId}
              photos={photos.map((photo) => photo?.dataUrl ?? null)}
              filterId={filterId}
              caption={customText}
              dateLabel={previewDate}
            />
          </StripFit>
        </aside>
      </div>

      <div className="sticky bottom-3 z-20 mt-6 lg:hidden">
        <Link to={nextHref} className={buttonClass("primary", "lg", "w-full")}>
          {complete ? copy.frames.backToEditor : copy.frames.shoot}
        </Link>
      </div>

      <ConfirmDialog
        open={pendingLayout !== null}
        title={copy.frames.changeTitle}
        body={copy.frames.changeBody}
        confirmLabel={copy.frames.changeConfirm}
        cancelLabel={copy.frames.keepPhotos}
        onCancel={() => setPendingLayout(null)}
        onConfirm={() => {
          if (pendingLayout) selectLayout(pendingLayout);
          setPendingLayout(null);
        }}
      />
    </div>
  );
}

function LayoutGlyph({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div
      className="grid h-20 w-14 gap-1 rounded-xl border-2 border-ink bg-cream p-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns * rows }, (_, index) => (
        <span key={index} className="rounded-[3px] bg-ink/80" />
      ))}
    </div>
  );
}
