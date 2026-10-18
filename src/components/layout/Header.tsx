import { Heart, Home, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { brand } from "@/lib/brand";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { buttonClass } from "../common/Button";
import { LanguageSwitch } from "../common/LanguageSwitch";

export function Header() {
  const [open, setOpen] = useState(false);
  const { copy } = useI18n();
  const links = [
    { to: "/", label: copy.nav.home, end: true },
    { to: "/frames", label: copy.nav.frames, end: false },
    { to: "/#how-it-works", label: copy.nav.how, end: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold sm:text-2xl" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-bubblegum text-white shadow-[3px_3px_0_#40354B]">
            <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
          </span>
          {brand.name}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <nav className="hidden items-center gap-1 md:flex" aria-label={copy.nav.primary}>
            {links.map((link) =>
              link.to.startsWith("/#") ? (
                <a key={link.to} href={link.to} className="rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink">
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn("rounded-full px-3 py-2 font-display font-semibold hover:bg-softpink", isActive && "bg-butter")
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
            <Link to="/frames" className={buttonClass("primary", "md", "ml-2")}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {copy.nav.start}
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

      {open ? (
        <nav className="border-t-2 border-ink/10 px-4 py-3 md:hidden" aria-label={copy.nav.mobile}>
          <div className="flex flex-col gap-2">
            <Link to="/" className="rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink" onClick={() => setOpen(false)}>
              <Home className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {copy.nav.home}
            </Link>
            <Link to="/frames" className="rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink" onClick={() => setOpen(false)}>
              {copy.nav.frames}
            </Link>
            <a href="/#how-it-works" className="rounded-2xl px-3 py-3 font-display text-lg font-semibold hover:bg-softpink" onClick={() => setOpen(false)}>
              {copy.nav.how}
            </a>
            <Link to="/frames" className={buttonClass("primary", "lg")} onClick={() => setOpen(false)}>
              {copy.nav.startHeart}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
