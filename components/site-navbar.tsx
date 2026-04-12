"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GitBranch } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Деректер" },
  { href: "/search", label: "Іздеу" },
  { href: "/analysis", label: "Аналитика" },
  { href: "/download", label: "Жүктеу" },
  { href: "/about", label: "Туралы" },
];

const languages = ["ҚАЗ", "ENG", "RUS"];

interface SiteNavbarProps {
  userEmail?: string | null;
}

export function SiteNavbar({ userEmail }: SiteNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountLabel = userEmail ? "Профиль" : "Кіру";
  const accountHref = userEmail ? "/account" : "/auth";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-subtle bg-bg-secondary/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary text-lg font-semibold text-white shadow-glow transition-transform duration-200 ease-in-out group-hover:scale-105">
              Ә
            </span>
            <span className="text-base font-medium text-text-primary sm:text-lg">Әндер корпусы</span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out",
                    active
                      ? "bg-white/10 text-text-primary"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="inline-flex items-center rounded-full border border-subtle bg-white/5 p-1">
              {languages.map((lang, idx) => (
                <button
                  type="button"
                  key={lang}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                    idx === 0
                      ? "bg-accent-primary text-white"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                  aria-label={`Интерфейс тілін ${lang} ету`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <Link
              href={accountHref}
              className="rounded-full border border-subtle bg-white/5 px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-white/10"
            >
              {accountLabel}
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub бетіне өту"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-white/5 text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              <GitBranch size={18} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-white/5 text-text-primary lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label="Мобильді мәзірді ашу"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.aside
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-bg-primary/95 px-6 pt-28 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "rounded-2xl border border-subtle px-4 py-3 text-lg font-medium",
                    pathname === item.href
                      ? "bg-accent-primary/20 text-text-primary"
                      : "bg-white/5 text-text-secondary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 inline-flex w-fit items-center rounded-full border border-subtle bg-white/5 p-1">
              {languages.map((lang, idx) => (
                <button
                  type="button"
                  key={lang}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    idx === 0 ? "bg-accent-primary text-white" : "text-text-secondary",
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            <Link
              href={accountHref}
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 inline-flex w-fit rounded-full border border-subtle bg-white/5 px-4 py-2 text-sm font-medium text-text-primary"
            >
              {accountLabel}
            </Link>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
