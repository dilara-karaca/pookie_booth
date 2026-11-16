import { Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { brand } from "@/lib/brand";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { scrollLanding } from "@/lib/landingScroll";
import { LanguageSwitch } from "../common/LanguageSwitch";

export function Header() {
  const [open, setOpen] = useState(false);
  const [howVisible, setHowVisible] = useState(() => window.location.hash === "#how");
  const reduce = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const { copy } = useI18n();
  const close = () => setOpen(false);
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
  const showHome = (event: { preventDefault(): void }) => {
    if (location.pathname !== "/") return;
    event.preventDefault();
    scrollLanding("home", behavior);
    if (location.hash) navigate("/", { replace: true });
  };
  const onLanding = location.pathname === "/";
  const homeActive = onLanding && !howVisible;
  const howActive = onLanding && howVisible;

  useEffect(() => {
    const root = document.getElementById("landing-scroll");
    const how = document.getElementById("how");
    if (!root || !how) {
      setHowVisible(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setHowVisible(entry.isIntersecting), {
      root,
      threshold: 0.55,
    });
    observer.observe(how);
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-xl font-bold sm:text-2xl"
          onClick={(event) => {
            close();
            showHome(event);
          }}
        >
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
            <Link
              to="/"
              className={cn("rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink", homeActive && "bg-butter")}
              aria-current={homeActive ? "page" : undefined}
              onClick={showHome}
            >
              {copy.nav.home}
            </Link>
            <Link
              to={{ pathname: "/", hash: "#how" }}
              className={cn("rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink", howActive && "bg-butter")}
              aria-current={howActive ? "page" : undefined}
              onClick={(event) => {
                if (location.pathname !== "/") return;
                event.preventDefault();
                scrollLanding("how", behavior);
              }}
            >
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
              <Link
                to="/"
                className={cn(
                  "rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink",
                  homeActive && "bg-butter",
                )}
                aria-current={homeActive ? "page" : undefined}
                onClick={(event) => {
                  close();
                  showHome(event);
                }}
              >
                {copy.nav.home}
              </Link>
              <Link
                to={{ pathname: "/", hash: "#how" }}
                className={cn(
                  "rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink",
                  howActive && "bg-butter",
                )}
                aria-current={howActive ? "page" : undefined}
                onClick={(event) => {
                  close();
                  if (location.pathname !== "/") return;
                  event.preventDefault();
                  scrollLanding("how", behavior);
                }}
              >
                {copy.nav.how}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
