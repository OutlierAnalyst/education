import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import Pricing from "@/components/sections/Pricing";
import Button from "@/components/ui/Button";
import AnimateIn from "@/components/ui/AnimateIn";

export const metadata: Metadata = {
  title: "О проекте — HabitSync",
  description: "HabitSync — интерактивный веб-сервис для систематизации задач, формирования привычек и повышения продуктивности.",
};

export default function AboutPage() {
  return (
    <div className="pt-[72px]">
      <AboutSection />
      <Pricing />

      <section className="py-16 text-center">
        <AnimateIn>
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-4">Готов начать?</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Попробуй наши бесплатные инструменты прямо сейчас — калькуляторы и трекер привычек доступны без регистрации.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button href="/tools" size="lg">
                <span>📊</span> К калькуляторам
              </Button>
              <Button href="/contacts" variant="outline" size="lg">
                <span>💬</span> Связаться с нами
              </Button>
            </div>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
