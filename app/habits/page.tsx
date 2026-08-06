import type { Metadata } from "next";
import HabitTracker from "@/components/sections/HabitTracker";
import WeeklyChart from "@/components/sections/WeeklyChart";
import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Трекер привычек — HabitSync",
  description: "Отмечай выполненные задачи, добавляй свои привычки и отслеживай прогресс за неделю с HabitSync.",
};

export default function HabitsPage() {
  return (
    <div className="pt-[72px]">
      <section className="py-24 max-md:py-16">
        <div className="max-w-container mx-auto px-6">
          <AnimateIn>
            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
              Трекер привычек
            </h1>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[600px] mx-auto">
              Добавляй свои ежедневные привычки, отмечай выполненные и наблюдай за прогрессом. Чем больше галочек — тем выше продуктивность!
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <AnimateIn>
              <HabitTracker />
            </AnimateIn>
            <AnimateIn delay={100}>
              <WeeklyChart />
            </AnimateIn>
          </div>

          <AnimateIn delay={200}>
            <div className="mt-12 text-center">
              <p className="text-text-secondary mb-4">Хочешь получить персональный разбор привычек?</p>
              <Button href="/contacts" size="lg">
                <span>🚀</span> Оставить заявку
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
