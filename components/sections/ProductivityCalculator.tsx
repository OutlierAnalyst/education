"use client";

import { useState, useCallback } from "react";
import AnimateIn from "@/components/ui/AnimateIn";

function calcProductivityIndex(sleep: number, focus: number, exercise: number, screenTime: number): number {
  let sleepScore: number;
  if (sleep >= 7 && sleep <= 8) sleepScore = 30;
  else if (sleep >= 6 && sleep < 7) sleepScore = 22;
  else if (sleep > 8 && sleep <= 9) sleepScore = 24;
  else if (sleep >= 5 && sleep < 6) sleepScore = 14;
  else if (sleep > 9) sleepScore = 16;
  else sleepScore = 8;

  const focusScore = Math.min((focus / 6) * 30, 30);
  const exerciseScore = Math.min((exercise / 60) * 20, 20);
  const screenPenalty = Math.min((screenTime / 5) * 20, 20);

  return Math.max(0, Math.min(100, Math.round(sleepScore + focusScore + exerciseScore - screenPenalty)));
}

function getTip(score: number): string {
  if (score >= 80) return "🔥 Отличный результат! Ты на пике продуктивности!";
  if (score >= 60) return "💪 Хороший уровень! Попробуй сократить экранное время.";
  if (score >= 40) return "⚠️ Средний уровень. Добавь физической активности и сна.";
  return "😴 Низкий индекс. Начни с нормализации сна и режима.";
}

function getRingColor(score: number): string {
  if (score >= 70) return "var(--accent)";
  if (score >= 40) return "#ffab00";
  return "#ff5252";
}

export default function ProductivityCalculator() {
  const [sleep, setSleep] = useState(7);
  const [focus, setFocus] = useState(4);
  const [exercise, setExercise] = useState(30);
  const [screenTime, setScreenTime] = useState(3);

  const score = calcProductivityIndex(sleep, focus, exercise, screenTime);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const SliderRow = useCallback(
    ({
      label,
      id,
      min,
      max,
      step,
      value,
      onChange,
      unit,
    }: {
      label: string;
      id: string;
      min: number;
      max: number;
      step: number;
      value: number;
      onChange: (v: number) => void;
      unit: string;
    }) => (
      <div className="mb-5">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
        <div className="flex items-center gap-3.5">
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="min-w-[56px] text-right text-[0.95rem] font-bold text-accent">
            {value} {unit}
          </span>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="bg-surface-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-border-hover hover:shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 px-7 py-6 border-b border-border">
        <span className="text-[1.6rem]">⚡</span>
        <h3 className="text-[1.1rem] font-bold">Индекс продуктивности</h3>
      </div>
      <div className="p-7">
        <SliderRow label="Часов сна в сутки" id="calcSleep" min={3} max={12} step={0.5} value={sleep} onChange={setSleep} unit="ч" />
        <SliderRow label="Часов глубокой работы" id="calcFocus" min={0} max={12} step={0.5} value={focus} onChange={setFocus} unit="ч" />
        <SliderRow label="Минут физической активности" id="calcExercise" min={0} max={120} step={5} value={exercise} onChange={setExercise} unit="мин" />
        <SliderRow label="Часов экранного времени (не по работе)" id="calcScreen" min={0} max={10} step={0.5} value={screenTime} onChange={setScreenTime} unit="ч" />

        <div className="mt-7 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary font-medium mb-4">Твой индекс продуктивности</p>
          <div className="flex justify-center mb-4">
            <div className="relative w-[120px] h-[120px]">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" className="progress-ring__bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="progress-ring__fill"
                  style={{ strokeDashoffset: offset, stroke: getRingColor(score) }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[1.8rem] font-extrabold text-accent">
                {score}
              </span>
            </div>
          </div>
          <p className="text-sm text-text-muted italic">{getTip(score)}</p>
        </div>
      </div>
    </div>
  );
}
