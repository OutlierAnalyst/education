"use client";

import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function Toast({
  show,
  onClose,
  title = "Спасибо за заявку!",
  message = "Мы свяжемся с тобой в течение 24 часов.",
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-8 right-8 max-md:left-4 max-md:right-4 max-md:bottom-4 flex items-center gap-3.5 px-6 py-4 bg-surface-card border border-accent rounded-[14px] z-[2000] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-[140%] opacity-0 pointer-events-none"
      }`}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 0 20px var(--accent-glow)",
      }}
      role="alert"
    >
      <span className="text-[1.6rem] shrink-0">✅</span>
      <div>
        <strong className="text-[0.95rem] block text-text-primary">{title}</strong>
        <p className="text-sm text-text-secondary mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-text-muted text-2xl cursor-pointer p-0 min-w-[44px] min-h-[44px] flex items-center justify-center ml-1 shrink-0 hover:text-text-primary transition-colors"
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  );
}
