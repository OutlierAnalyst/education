"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/tools", label: "Калькуляторы" },
  { href: "/habits", label: "Трекер" },
  { href: "/about", label: "О проекте" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[72px] z-[1000] bg-surface-navbar backdrop-blur-[20px] border-b border-border transition-all duration-300 ${
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.15)]" : ""
        }`}
      >
        <div className="max-w-container mx-auto px-6 flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-[1.35rem] font-extrabold text-text-primary flex items-center gap-1 tracking-tight no-underline hover:text-text-primary"
          >
            <span className="text-[1.4rem]">⚡</span> Habit
            <span className="text-accent">Sync</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 no-underline ${
                  pathname === link.href
                    ? "text-accent bg-accent-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-accent-subtle"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 border border-border rounded-sm bg-surface-card flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-accent hover:bg-accent-subtle relative overflow-hidden"
              aria-label="Переключить тему"
            >
              {mounted && (
                <>
                  <span
                    className={`text-[1.15rem] absolute transition-all duration-300 ${
                      theme === "dark"
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-90"
                    }`}
                  >
                    ☀️
                  </span>
                  <span
                    className={`text-[1.15rem] absolute transition-all duration-300 ${
                      theme === "light"
                        ? "opacity-100 rotate-0"
                        : "opacity-0 rotate-90"
                    }`}
                  >
                    🌙
                  </span>
                </>
              )}
            </button>

            {/* Burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2.5 min-w-[44px] min-h-[44px] items-center justify-center bg-transparent border border-border rounded-sm cursor-pointer"
              aria-label="Меню"
            >
              <span
                className={`block w-5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-x-[5px] translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 translate-x-[5px] -translate-y-[5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed top-[72px] left-0 right-0 bg-surface-secondary border-b border-border z-[999] transition-all duration-300 ${
          mobileOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3.5 text-base font-medium rounded-sm no-underline min-h-[44px] flex items-center transition-all duration-300 ${
                pathname === link.href
                  ? "text-accent bg-accent-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-accent-subtle"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
