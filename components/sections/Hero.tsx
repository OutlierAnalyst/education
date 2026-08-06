"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import AnimateIn from "@/components/ui/AnimateIn";

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            el.querySelectorAll<HTMLSpanElement>("[data-count]").forEach((span) => {
              const target = parseInt(span.dataset.count || "0");
              const duration = 2000;
              const start = performance.now();
              function update(now: number) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                span.textContent = Math.floor(eased * target).toLocaleString("ru-RU");
                if (progress < 1) requestAnimationFrame(update);
              }
              requestAnimationFrame(update);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-[72px]">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] -top-[100px] -right-[100px] pointer-events-none animate-float" />

      <div className="max-w-container mx-auto px-6 text-center py-20 md:py-16">
        <AnimateIn>
          <div className="inline-block px-5 py-2 bg-accent-subtle border border-[rgba(0,230,118,0.15)] rounded-full text-sm font-medium text-accent mb-7">
            Бесплатные инструменты продуктивности
          </div>
        </AnimateIn>

        <AnimateIn delay={80}>
          <h1 className="text-[clamp(2.2rem,6vw,4rem)] font-black leading-[1.15] tracking-tight mb-5">
            Синхронизируй{" "}
            <span className="text-accent">привычки</span>,<br />
            прокачай <span className="text-accent">продуктивность</span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={160}>
          <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-text-secondary max-w-[600px] mx-auto mb-9 leading-relaxed">
            HabitSync — интерактивный хаб, который поможет рассчитать личные показатели,
            выстроить ежедневные привычки и взять жизнь под контроль.
          </p>
        </AnimateIn>

        <AnimateIn delay={240}>
          <div className="flex gap-4 justify-center flex-wrap mb-10 max-sm:flex-col max-sm:items-stretch">
            <Button href="/tools" size="lg">
              <span>📊</span> Рассчитать показатели
            </Button>
            <Button href="/habits" variant="outline" size="lg">
              <span>✅</span> Попробовать чек-лист
            </Button>
          </div>
        </AnimateIn>

        <AnimateIn delay={320}>
          <div className="max-w-[520px] mx-auto mb-12 w-full">
            <Image
              src="/hero-illustration.svg"
              alt="Дашборд продуктивности HabitSync"
              width={560}
              height={400}
              priority
              className="w-full h-auto rounded-lg drop-shadow-[0_8px_32px_rgba(0,230,118,0.1)]"
            />
          </div>
        </AnimateIn>

        <AnimateIn delay={400}>
          <div
            ref={statsRef}
            className="flex justify-center gap-12 flex-wrap max-sm:flex-col max-sm:gap-4"
          >
            {[
              { count: 12847, label: "Расчётов выполнено" },
              { count: 3920, label: "Активных пользователей" },
              { count: 98, label: "% довольных клиентов" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span
                  data-count={stat.count}
                  className="block text-[2rem] max-md:text-[1.6rem] font-extrabold text-accent tracking-tight"
                >
                  0
                </span>
                <span className="text-sm max-md:text-[0.88rem] text-text-secondary mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
