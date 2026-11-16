import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { buttonClass } from "@/components/common/Button";
import { Floaters, HeartDecor, StarDecor } from "@/components/decorations/Decor";
import { Photostrip } from "@/features/frames/components/Photostrip";
import type { DemoScene } from "@/features/frames/utils/demoPhotos";
import { getDemoPhoto } from "@/features/frames/utils/demoPhotos";
import type { FrameLayout } from "@/features/frames/types";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { usePageTitle } from "@/hooks/usePageTitle";
import { scrollLanding } from "@/lib/landingScroll";
import { HowPage } from "@/pages/HowPage";

const demoDate = "18.10.2026 · 21:53";

const heroStrips: Array<{
  layoutId: FrameLayout;
  designId: string;
  captionKey: "besties" | "night" | "hello";
  scenes: DemoScene[];
  className: string;
}> = [
  {
    layoutId: "vertical-4",
    designId: "lovely-pink-hearts",
    captionKey: "besties",
    scenes: ["blush", "sunset", "studio", "meadow"],
            className: "sway relative z-10 w-[46%] -rotate-6",
  },
  {
    layoutId: "vertical-3",
    designId: "retro-stars",
    captionKey: "night",
    scenes: ["night", "sky", "studio"],
    className: "sway sway-late absolute top-6 right-0 z-20 w-[42%] rotate-6",
  },
  {
    layoutId: "vertical-2",
    designId: "classic-butter",
    captionKey: "hello",
    scenes: ["sunset", "meadow"],
    className: "sway sway-later absolute bottom-0 left-[18%] z-0 w-[34%] rotate-3",
  },
];

export function HomePage() {
  const { copy } = useI18n();
  const reduce = useReducedMotion();
  const location = useLocation();
  const samples = copy.home.samples;
  const [howVisible, setHowVisible] = useState(() => window.location.hash === "#how");
  usePageTitle(howVisible ? copy.pages.how : undefined);

  useLayoutEffect(() => {
    if (location.hash !== "#how") return;
    scrollLanding("how", "instant");
  }, [location.hash]);

  useEffect(() => {
    const root = document.getElementById("landing-scroll");
    const how = document.getElementById("how");
    if (!root || !how) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHowVisible(entry.isIntersecting),
      { root, threshold: 0.55 },
    );
    observer.observe(how);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="landing-scroll"
      className={cn("h-full snap-y overflow-y-auto", reduce ? "snap-proximity" : "snap-mandatory scroll-smooth")}
    >
      <section className="relative flex h-full min-h-0 snap-start snap-always flex-col overflow-hidden">
        <Floaters />
        <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 items-center gap-6 overflow-hidden px-4 py-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex flex-wrap gap-2">
              {copy.home.badges.map((label) => (
                <span key={label} className="rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-sm font-semibold">
                  {label}
                </span>
              ))}
            </div>
            <h1 className="mt-5 font-display text-6xl leading-[0.9] font-bold tracking-tight sm:text-7xl lg:text-8xl">
              {copy.home.lead}{" "}
              <span className="wiggle inline-block -rotate-2 rounded-3xl border-2 border-ink bg-butter px-3 py-1 shadow-[6px_6px_0_#FF8FAB]">
                {copy.home.accent}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug sm:text-2xl">{copy.home.tagline}</p>
            <div className="mt-7">
              <Link to="/frames" className={buttonClass("primary", "lg")}>
                {copy.home.start}
              </Link>
            </div>
          </motion.div>

          <div className="bg-checker relative mx-auto h-[min(240px,32svh)] w-full max-w-lg overflow-hidden rounded-[2.5rem] border-2 border-ink shadow-[8px_8px_0_#40354B] sm:h-[min(520px,52svh)] lg:h-[min(620px,64svh)]">
            <StarDecor className="floaty absolute top-6 left-6 z-30 h-10 w-10 text-coral" />
            <HeartDecor className="floaty absolute right-8 bottom-8 z-30 h-10 w-10 text-bubblegum" />
            {heroStrips.map((strip) => (
              <div key={strip.designId} className={strip.className}>
                <Photostrip
                  layoutId={strip.layoutId}
                  designId={strip.designId}
                  photos={strip.scenes.map((scene) => getDemoPhoto(scene))}
                  filterId="original"
                  caption={samples[strip.captionKey]}
                  dateLabel={demoDate}
                  density="thumbnail"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="mx-auto mb-3 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-white shadow-[3px_3px_0_#40354B]"
          aria-label={copy.nav.how}
          onClick={() => scrollLanding("how", reduce ? "auto" : "smooth")}
        >
          <ChevronDown aria-hidden="true" />
        </button>
      </section>
      <HowPage />
    </div>
  );
}
