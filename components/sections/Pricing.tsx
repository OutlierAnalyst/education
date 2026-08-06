"use client";

import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";

const plans = [
  {
    badge: "Бесплатно",
    title: "Базовый",
    price: "0 ₽",
    popular: false,
    features: [
      { text: "Интерактивный калькулятор", included: true },
      { text: "Чек-лист привычек", included: true },
      { text: "Графики продуктивности", included: true },
      { text: "Персональный разбор", included: false },
      { text: "Индивидуальный план", included: false },
    ],
    cta: { label: "Начать бесплатно", href: "/tools", variant: "outline" as const },
  },
  {
    badge: "Популярный",
    title: "Аудит продуктивности",
    price: "2 900 ₽",
    popular: true,
    features: [
      { text: "Всё из Базового", included: true },
      { text: "Персональный аудит", included: true },
      { text: "Детальный разбор привычек", included: true },
      { text: "Рекомендации от эксперта", included: true },
      { text: "30-дневное сопровождение", included: false },
    ],
    cta: { label: "Оставить заявку", href: "/contacts", variant: "primary" as const },
  },
  {
    badge: "Максимум",
    title: "Трекинг 30 дней",
    price: "7 500 ₽",
    popular: false,
    features: [
      { text: "Всё из Аудита", included: true },
      { text: "Персональный трекер", included: true },
      { text: "30-дневное сопровождение", included: true },
      { text: "Еженедельные созвоны", included: true },
      { text: "Корректировка плана", included: true },
    ],
    cta: { label: "Оставить заявку", href: "/contacts", variant: "outline" as const },
  },
];

export default function Pricing() {
  return (
    <section className="py-24 max-md:py-16 bg-surface-secondary transition-colors duration-300">
      <div className="max-w-container mx-auto px-6">
        <AnimateIn>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
            Тарифы
          </h2>
        </AnimateIn>
        <AnimateIn delay={80}>
          <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
            Выбери подходящий формат работы
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.title} delay={i * 100}>
              <div
                className={`bg-surface-card border rounded-lg p-8 max-md:p-7 text-center transition-all duration-300 relative hover:-translate-y-1 hover:shadow-[var(--shadow-card)] ${
                  plan.popular
                    ? "border-accent shadow-[var(--shadow-glow)]"
                    : "border-border"
                }`}
              >
                <span
                  className={`inline-block px-3.5 py-1 text-[0.82rem] font-semibold rounded-full uppercase tracking-wider mb-4 ${
                    plan.popular
                      ? "bg-accent text-[#0f1115]"
                      : "bg-accent-subtle text-accent"
                  }`}
                >
                  {plan.badge}
                </span>
                <h3 className="text-[1.2rem] font-bold mb-2">{plan.title}</h3>
                <div className="text-[2.2rem] font-extrabold text-accent mb-6">
                  {plan.price}
                </div>
                <ul className="list-none text-left mb-7">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className={`py-2 text-[0.92rem] flex items-center gap-2.5 ${
                        f.included ? "text-text-secondary" : "text-text-muted"
                      }`}
                    >
                      <span className={f.included ? "text-accent font-bold text-sm" : "text-text-muted"}>
                        {f.included ? "✓" : "—"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Button href={plan.cta.href} variant={plan.cta.variant} full>
                  {plan.cta.label}
                </Button>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
