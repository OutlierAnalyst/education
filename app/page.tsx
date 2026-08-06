import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import ProductivityCalculator from "@/components/sections/ProductivityCalculator";
import WaterCalculator from "@/components/sections/WaterCalculator";
import HabitTracker from "@/components/sections/HabitTracker";
import WeeklyChart from "@/components/sections/WeeklyChart";
import Pricing from "@/components/sections/Pricing";
import AboutSection from "@/components/sections/AboutSection";
import ContactForm from "@/components/sections/ContactForm";
import AnimateIn from "@/components/ui/AnimateIn";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />

      {/* Calculators */}
      <section className="py-24 max-md:py-16 bg-surface-secondary transition-colors duration-300">
        <div className="max-w-container mx-auto px-6">
          <AnimateIn>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
              Интерактивные калькуляторы
            </h2>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
              Рассчитай персональные показатели в реальном времени
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
        </div>
      </section>

      {/* Tracker + Analytics */}
      <section className="py-24 max-md:py-16">
        <div className="max-w-container mx-auto px-6">
          <AnimateIn>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
              Трекер привычек
            </h2>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
              Отмечай выполненные задачи и следи за прогрессом
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
        </div>
      </section>

      <Pricing />
      <AboutSection />
      <ContactForm />
    </>
  );
}
