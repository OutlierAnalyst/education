"use client";

import AnimateIn from "@/components/ui/AnimateIn";

const features = [
  {
    icon: "📐",
    title: "Рассчитай показатели",
    text: "Введи свои данные и мгновенно получи персональный индекс продуктивности и суточную норму воды.",
  },
  {
    icon: "🎯",
    title: "Построй привычки",
    text: "Создай свой чек-лист ежедневных привычек, отслеживай прогресс и формируй полезные рутины.",
  },
  {
    icon: "📈",
    title: "Отслеживай динамику",
    text: "Наблюдай за графиком своей продуктивности, анализируй тренды и улучшай результаты каждый день.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-16">
      <div className="max-w-container mx-auto px-6">
        <AnimateIn>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
            Как это работает
          </h2>
        </AnimateIn>
        <AnimateIn delay={80}>
          <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
            Три простых шага к системной продуктивности
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimateIn key={f.title} delay={i * 100}>
              <div className="bg-surface-card border border-border rounded-lg p-9 max-md:p-7 relative overflow-hidden transition-all duration-300 cursor-default group hover:border-accent hover:bg-surface-card-hover hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                <span className="text-[2.6rem] block mb-5">{f.icon}</span>
                <h3 className="text-[1.15rem] font-bold mb-2.5">{f.title}</h3>
                <p className="text-text-secondary text-[0.95rem] leading-relaxed">
                  {f.text}
                </p>
                <div className="absolute -bottom-[30px] -right-[30px] w-[120px] h-[120px] bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
