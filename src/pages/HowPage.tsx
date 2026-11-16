import { Camera, Download, Frame } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/LanguageProvider";

const stepStyles = [
  { icon: Frame, className: "bg-softpink -rotate-1" },
  { icon: Camera, className: "bg-butter rotate-1" },
  { icon: Download, className: "bg-sky -rotate-1" },
];

export function HowPage() {
  const { copy } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section id="how" className="bg-skywash flex h-full snap-start snap-always flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-4 sm:py-8">
        <h1 className="font-display text-4xl font-bold sm:text-6xl">
          {copy.home.howLead} <span className="text-coral">{copy.home.howAccent}</span>
        </h1>
        <div className="mt-4 grid gap-3 sm:mt-6 md:grid-cols-3 md:gap-5">
          {copy.home.steps.map((step, index) => {
            const style = stepStyles[index];
            const Icon = style.icon;
            return (
              <motion.article
                key={step.title}
                className={`rounded-[2rem] border-2 border-ink p-4 shadow-[6px_6px_0_#40354B] sm:p-6 ${style.className}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-white font-display text-lg font-bold sm:h-12 sm:w-12 sm:text-xl">
                    {index + 1}
                  </span>
                  <Icon aria-hidden="true" />
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold sm:mt-5 sm:text-3xl">{step.title}</h2>
                <p className="mt-2 text-base leading-snug sm:text-lg">{step.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
      <Footer flush />
    </section>
  );
}
