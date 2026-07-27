"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, Search, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import TopBar from "./TopBar";
import MobileMenu from "./MobileMenu";

export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projets" },
  { key: "history", href: "/notre-histoire" },
  { key: "mre", href: "/espace-mre" },
  { key: "contact", href: "/contact" },
] as const;

/**
 * Fixed header. On the homepage it sits transparent over the hero and
 * turns solid ivory after 80vh of scroll; on internal pages it is solid
 * from the start (a spacer keeps content below it, constant height —
 * no layout shift). The TopBar row collapses on any scroll.
 */
export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false); // past main threshold
  const [movedAtAll, setMovedAtAll] = useState(false); // topbar collapse
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = isHome ? window.innerHeight * 0.8 : 24;
      setScrolled(window.scrollY > threshold);
      setMovedAtAll(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* TopBar collapses via grid-rows trick for a smooth height animation */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: movedAtAll ? "0fr" : "1fr" }}
        >
          <div className="overflow-hidden">
            <TopBar />
          </div>
        </div>

        <div
          className={`transition-colors duration-300 ${
            transparent
              ? "bg-transparent text-white"
              : "bg-ivory text-foreground shadow-thin"
          }`}
        >
          <div className="mx-auto flex h-[68px] max-w-screen-2xl items-center justify-between gap-6 px-4 md:px-8">
            {/* Logo — duotone crossfade, no layout shift (stacked variants) */}
            <Link
              href="/"
              className="relative block h-9 w-36 shrink-0"
              aria-label={t("home")}
            >
              <Image
                src="/logo/sbai-mono-gold.png"
                alt=""
                fill
                sizes="144px"
                priority
                className={`object-contain transition-opacity duration-300 ${
                  transparent ? "opacity-100" : "opacity-0"
                }`}
              />
              <Image
                src="/logo/sbai-mono-charcoal.png"
                alt="SBAI Abdelhai & Associés"
                fill
                sizes="144px"
                priority
                className={`object-contain transition-opacity duration-300 ${
                  transparent ? "opacity-0" : "opacity-100"
                }`}
              />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Navigation principale" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV_ITEMS.map(({ key, href }) => {
                  const active =
                    href === "/" ? pathname === "/" : pathname.startsWith(href);
                  return (
                    <li key={key}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`micro-label relative py-2 transition-colors hover:text-gold ${
                          active ? "text-gold" : ""
                        }`}
                      >
                        {t(key)}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute inset-x-0 -bottom-1 h-px bg-gold"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {/* TODO(phase-later): search modal — placeholder trigger only */}
              <button
                type="button"
                aria-label={t("search")}
                title={t("searchSoon")}
                className="hidden p-2 transition-colors hover:text-gold lg:block"
              >
                <Search size={18} aria-hidden />
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={menuOpen}
                className="p-2 transition-colors hover:text-gold lg:hidden"
              >
                {menuOpen ? (
                  <X size={22} aria-hidden />
                ) : (
                  <Menu size={22} aria-hidden />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer: internal pages only (homepage hero flows under the header) */}
      {!isHome && <div aria-hidden className="h-[104px]" />}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
