import { Camera, Download, Frame } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { buttonClass } from "@/components/common/Button";
import { Floaters, HeartDecor, StarDecor } from "@/components/decorations/Decor";
import { Photostrip } from "@/features/frames/components/Photostrip";
import type { DemoScene } from "@/features/frames/utils/demoPhotos";
import { getDemoPhoto } from "@/features/frames/utils/demoPhotos";
import type { FrameLayout } from "@/features/frames/types";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { usePageTitle } from "@/hooks/usePageTitle";
import { hasAnyPhoto, useSession } from "@/store/session";

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

const showcase: Array<{
  layoutId: FrameLayout;
  designId: string;
  captionKey: "besties" | "nightOut" | "skyDay" | "sweet" | "party" | "y2k";
  scenes: DemoScene[];
}> = [
  { layoutId: "vertical-4", designId: "lovely-pink-hearts", captionKey: "besties", scenes: ["blush", "studio", "sunset", "meadow"] },
  { layoutId: "vertical-3", designId: "retro-stars", captionKey: "nightOut", scenes: ["night", "sky", "blush"] },
  { layoutId: "grid-4", designId: "gingham-blue", captionKey: "skyDay", scenes: ["sky", "meadow", "studio", "sunset"] },
  { layoutId: "vertical-4", designId: "sweet-strawberry", captionKey: "sweet", scenes: ["sunset", "blush", "meadow", "studio"] },
  { layoutId: "grid-6", designId: "special-birthday", captionKey: "party", scenes: ["studio", "sky", "night", "blush", "meadow", "sunset"] },
  { layoutId: "vertical-2", designId: "retro-y2k-hearts", captionKey: "y2k", scenes: ["blush", "night"] },
];

const stepStyles = [
  { icon: Frame, className: "bg-softpink -rotate-1" },
  { icon: Camera, className: "bg-butter rotate-1" },
  { icon: Download, className: "bg-sky -rotate-1" },
];

export function HomePage() {
  usePageTitle();
  const { copy } = useI18n();
  const reduce = useReducedMotion();
  const selectLayout = useSession((state) => state.selectLayout);
  const selectDesign = useSession((state) => state.selectDesign);
  const navigate = useNavigate();
  const samples = copy.home.samples;

  return (
    <div>
      <section className="relative overflow-hidden">
        <Floaters />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
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

          <div className="bg-checker relative mx-auto h-[540px] w-full max-w-lg overflow-hidden rounded-[2.5rem] border-2 border-ink shadow-[8px_8px_0_#40354B] sm:h-[620px]">
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
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          {copy.home.howLead} <span className="text-coral">{copy.home.howAccent}</span>
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {copy.home.steps.map((step, index) => {
            const style = stepStyles[index];
            const Icon = style.icon;
            return (
            <motion.article
              key={step.title}
              className={`rounded-[2rem] border-2 border-ink p-6 shadow-[6px_6px_0_#40354B] ${style.className}`}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-white font-display text-xl font-bold">
                  {index + 1}
                </span>
                <Icon aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-3xl font-bold">{step.title}</h3>
              <p className="mt-2 text-lg leading-snug">{step.copy}</p>
            </motion.article>
            );
          })}
        </div>
      </section>

      <section id="frames" className="bg-skywash mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">{copy.home.showcase}</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
          {showcase.map((item, index) => (
            <motion.button
              key={`${item.layoutId}-${item.designId}`}
              type="button"
              className="rounded-[1.5rem] p-3 text-left"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              whileHover={reduce ? undefined : { y: -8, rotate: -1.5 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              onClick={() => {
                if (!hasAnyPhoto(useSession.getState().photos)) {
                  selectLayout(item.layoutId);
                  selectDesign(item.designId);
                }
                navigate("/frames");
              }}
            >
              <Photostrip
                layoutId={item.layoutId}
                designId={item.designId}
                photos={item.scenes.map((scene) => getDemoPhoto(scene))}
                filterId="original"
                caption={samples[item.captionKey]}
                dateLabel={demoDate}
                density="thumbnail"
              />
              <span className="mt-3 block text-center font-display text-lg font-semibold">{samples[item.captionKey]}</span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
