import type { Metadata } from "next";
import ProductivityCalculator from "@/components/sections/ProductivityCalculator";
import WaterCalculator from "@/components/sections/WaterCalculator";
import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Калькуляторы — HabitSync",
  description: "Рассчитай индекс продуктивности и суточную норму воды с помощью интерактивных калькуляторов HabitSync.",
};

export default function ToolsPage() {
  return (
    <div className="pt-[72px]">
      <section className="py-24 max-md:py-16 bg-surface-secondary transition-colors duration-300">
        <div className="max-w-container mx-auto px-6">
          <AnimateIn>
            <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
              Интерактивные калькуляторы
            </h1>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[600px] mx-auto">
              Рассчитай свой персональный индекс продуктивности и узнай, сколько воды нужно пить каждый день. Все расчёты происходят мгновенно — просто двигай ползунки.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <AnimateIn>
              <ProductivityCalculator />
            </AnimateIn>
            <AnimateIn delay={100}>
              <WaterCalculator />
            </AnimateIn>
          </div>

          <AnimateIn delay={200}>
            <div className="mt-12 text-center">
              <p className="text-text-secondary mb-4">Хочешь выстроить привычки на основе расчётов?</p>
              <Button href="/habits" variant="outline" size="lg">
                <span>✅</span> Перейти к трекеру привычек
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
