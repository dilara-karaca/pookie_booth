import { Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { brand } from "@/lib/brand";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "../common/LanguageSwitch";

const howTo = { pathname: "/", hash: "#how-it-works" };

export function Header() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { copy } = useI18n();
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold sm:text-2xl" onClick={close}>
          <motion.span
            className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-bubblegum text-white shadow-[3px_3px_0_#40354B]"
            whileHover={reduce ? undefined : { rotate: -8, scale: 1.06 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
          >
            <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
          </motion.span>
          {brand.name}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <nav className="hidden items-center gap-1 md:flex" aria-label={copy.nav.primary}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn("rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink", isActive && "bg-butter")
              }
            >
              {copy.nav.home}
            </NavLink>
            <Link to={howTo} className="rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink">
              {copy.nav.how}
            </Link>
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-ink bg-white md:hidden"
            aria-expanded={open}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            className="overflow-hidden border-t-2 border-ink/10 md:hidden"
            aria-label={copy.nav.mobile}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-2 px-4 py-3">
              <Link to="/" className="rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink" onClick={close}>
                {copy.nav.home}
              </Link>
              <Link to={howTo} className="rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink" onClick={close}>
                {copy.nav.how}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
