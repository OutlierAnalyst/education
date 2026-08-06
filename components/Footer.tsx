"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const footerLinks = [
  { href: "/", label: "Главная" },
  { href: "/tools", label: "Калькуляторы" },
  { href: "/habits", label: "Трекер" },
  { href: "/about", label: "О проекте" },
  { href: "/contacts", label: "Контакты" },
];

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <footer className="py-10 border-t border-border bg-surface-primary transition-colors duration-300">
      <div className="max-w-container mx-auto px-6 flex items-center justify-between flex-wrap gap-6 max-md:flex-col max-md:text-center">
        {/* Left */}
        <div>
          <Link
            href="/"
            className="text-[1.35rem] font-extrabold text-text-primary flex items-center gap-1 tracking-tight no-underline hover:text-text-primary max-md:justify-center"
          >
            <span className="text-[1.4rem]">⚡</span> Habit
            <span className="text-accent">Sync</span>
          </Link>
          <p className="text-sm text-text-muted mt-2">
            © {new Date().getFullYear()} HabitSync. Все права защищены.
          </p>
        </div>

        {/* Center Nav */}
        <nav className="flex gap-6 flex-wrap max-md:justify-center">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary text-sm no-underline min-h-[44px] inline-flex items-center hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4 max-md:justify-center">
          <div className="flex gap-2">
            {/* Telegram */}
            <a
              href="https://t.me/habitsync_dev"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
              className="text-text-muted min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm hover:text-accent hover:bg-accent-subtle transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            {/* VK */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="VK"
              className="text-text-muted min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm hover:text-accent hover:bg-accent-subtle transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.305-.491.745-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
              </svg>
            </a>
          </div>

          {/* Footer Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-11 h-11 border border-border rounded-sm bg-surface-card flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-accent hover:bg-accent-subtle relative overflow-hidden"
            aria-label="Переключить тему"
          >
            {mounted && (
              <>
                <span
                  className={`text-[1.15rem] absolute transition-all duration-300 ${
                    theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                >
                  ☀️
                </span>
                <span
                  className={`text-[1.15rem] absolute transition-all duration-300 ${
                    theme === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                  }`}
                >
                  🌙
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
