"use client";

import { useState } from "react";

export default function WaterCalculator() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(1.2);
  const [goal, setGoal] = useState("energy");

  let base = (weight * 30) / 1000;
  base *= activity;
  switch (goal) {
    case "weight_loss": base *= 1.1; break;
    case "muscle": base *= 1.15; break;
    case "energy": base *= 1.05; break;
  }
  const liters = Math.round(base * 10) / 10;
  const glasses = Math.round(liters / 0.25);
  const fillPercent = Math.min((liters / 4) * 100, 100);

  return (
    <div className="bg-surface-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-border-hover hover:shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 px-7 py-6 border-b border-border">
        <span className="text-[1.6rem]">💧</span>
        <h3 className="text-[1.1rem] font-bold">Суточная норма воды</h3>
      </div>
      <div className="p-7">
        {/* Weight */}
        <div className="mb-5">
          <label htmlFor="calcWeight" className="block text-sm font-medium text-text-secondary mb-2">
            Вес (кг)
          </label>
          <input
            type="number"
            id="calcWeight"
            min={30}
            max={250}
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 70)}
            className="w-full px-4 py-3 min-h-[44px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
            placeholder="70"
          />
        </div>

        {/* Activity */}
        <div className="mb-5">
          <label htmlFor="calcActivity" className="block text-sm font-medium text-text-secondary mb-2">
            Уровень активности
          </label>
          <select
            id="calcActivity"
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            className="w-full px-4 py-3 min-h-[44px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none cursor-pointer transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
          >
            <option value={1.0}>Низкий (сидячий образ жизни)</option>
            <option value={1.2}>Средний (лёгкие тренировки)</option>
            <option value={1.4}>Высокий (интенсивные тренировки)</option>
            <option value={1.6}>Очень высокий (спорт каждый день)</option>
          </select>
        </div>

        {/* Goal */}
        <div className="mb-5">
          <label htmlFor="calcGoal" className="block text-sm font-medium text-text-secondary mb-2">
            Цель
          </label>
          <select
            id="calcGoal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-3 min-h-[44px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none cursor-pointer transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
          >
            <option value="health">Поддержание здоровья</option>
            <option value="weight_loss">Снижение веса</option>
            <option value="muscle">Набор мышечной массы</option>
            <option value="energy">Максимум энергии</option>
          </select>
        </div>

        {/* Result */}
        <div className="mt-7 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary font-medium mb-4">Твоя суточная норма</p>
          <div className="flex items-center justify-center gap-7 max-sm:flex-col max-sm:gap-4">
            {/* Glass */}
            <div className="w-[70px] h-[100px] border-[3px] border-border-hover rounded-b-2xl border-t-0 relative overflow-hidden bg-surface-input">
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-[13px] transition-[height] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  height: `${fillPercent}%`,
                  background: "linear-gradient(180deg, var(--accent-teal), var(--accent))",
                }}
              />
              <div className="absolute inset-0">
                <span className="water-bubble absolute left-[20%] bottom-[10%] animate-bubble-1" />
                <span className="water-bubble absolute left-[50%] bottom-[5%] animate-bubble-2" />
                <span className="water-bubble absolute left-[75%] bottom-[15%] animate-bubble-3" />
              </div>
            </div>
            {/* Info */}
            <div className="flex flex-col items-start max-sm:items-center max-sm:text-center">
              <span className="text-[2.4rem] font-extrabold text-accent-teal leading-none">
                {liters.toFixed(1)}
              </span>
              <span className="text-sm text-text-secondary mt-1">литров / день</span>
              <span className="text-sm text-text-muted mt-1">≈ {glasses} стаканов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
