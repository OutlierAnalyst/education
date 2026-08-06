"use client";

import AnimateIn from "@/components/ui/AnimateIn";

const values = [
  { icon: "🔬", text: "Научный подход" },
  { icon: "🎨", text: "Красивый интерфейс" },
  { icon: "🚀", text: "Без воды — только польза" },
  { icon: "💚", text: "Бесплатные инструменты" },
];

export default function AboutSection() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-container mx-auto px-6">
        <AnimateIn>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
            О проекте
          </h2>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="max-w-[720px] mx-auto">
            <div className="space-y-5">
              <p className="text-[1.05rem] text-text-secondary leading-relaxed">
                <strong className="text-text-primary">HabitSync</strong> — это
                интерактивный веб-сервис, созданный для людей, которые хотят
                систематизировать свои задачи, выстроить полезные привычки и
                повысить личную продуктивность.
              </p>
              <p className="text-[1.05rem] text-text-secondary leading-relaxed">
                Мы верим, что продуктивность — это не про «делать больше», а про
                «делать важное». Наши инструменты помогут тебе понять, где ты
                сейчас, куда хочешь двигаться и как выстроить ежедневные ритуалы,
                чтобы достичь целей.
              </p>
              <p className="text-[1.05rem] text-text-secondary leading-relaxed">
                Проект разработан на основе исследований в области привычек,
                хронобиологии и когнитивной психологии. Мы объединили науку и
                технологии, чтобы дать тебе простые, но мощные инструменты для
                личного роста.
              </p>
            </div>

            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8">
              {values.map((v) => (
                <div
                  key={v.text}
                  className="flex items-center gap-3 px-5 py-4 min-h-[44px] bg-surface-card border border-border rounded-[14px] transition-all duration-300 hover:border-accent hover:-translate-y-0.5"
                >
                  <span className="text-2xl">{v.icon}</span>
                  <span className="text-[0.92rem] font-medium">{v.text}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
