"use client";

import { useState, useRef } from "react";

interface Habit {
  id: number;
  text: string;
  done: boolean;
}

const defaultHabits: Habit[] = [
  { id: 1, text: "Выпить стакан воды утром", done: false },
  { id: 2, text: "15 минут медитации", done: false },
  { id: 3, text: "Зарядка или тренировка", done: false },
  { id: 4, text: "2 часа глубокой работы без отвлечений", done: false },
  { id: 5, text: "Прочитать 20 страниц книги", done: false },
  { id: 6, text: "Записать 3 благодарности в дневник", done: false },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [input, setInput] = useState("");
  const nextId = useRef(7);

  const total = habits.length;
  const done = habits.filter((h) => h.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const removeHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const addHabit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setHabits((prev) => [
      ...prev,
      { id: nextId.current++, text: trimmed, done: false },
    ]);
    setInput("");
  };

  return (
    <div className="bg-surface-card border border-border rounded-lg overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-[1.05rem] font-bold">📋 Ежедневный чек-лист</h3>
        <span className="text-[1.1rem] font-extrabold text-accent">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border mx-6 mb-2 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, var(--accent), var(--accent-teal))",
          }}
        />
      </div>

      {/* Habit List */}
      <ul className="list-none px-6 max-h-[360px] overflow-y-auto">
        {habits.map((habit) => (
          <li
            key={habit.id}
            className="flex items-center justify-between py-3 min-h-[44px] border-b border-border last:border-b-0 animate-fade-in-up group"
          >
            <label className="flex items-center gap-3 cursor-pointer flex-1 min-h-[44px]">
              <input
                type="checkbox"
                checked={habit.done}
                onChange={() => toggleHabit(habit.id)}
                className="hidden"
              />
              <span
                className={`w-[22px] h-[22px] border-2 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 habit-checkmark ${
                  habit.done
                    ? "bg-accent border-accent shadow-[0_2px_8px_var(--accent-glow)] habit-checked"
                    : "border-border-hover"
                }`}
              />
              <span
                className={`text-[0.95rem] transition-all duration-300 ${
                  habit.done ? "line-through text-text-muted" : ""
                }`}
              >
                {habit.text}
              </span>
            </label>
            <button
              onClick={() => removeHabit(habit.id)}
              title="Удалить"
              className="bg-transparent border-none text-text-muted text-xl cursor-pointer p-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded opacity-0 group-hover:opacity-100 max-md:opacity-100 shrink-0 transition-all duration-300 hover:text-[#ff5252] hover:bg-[rgba(255,82,82,0.1)]"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {/* Add habit */}
      <div className="flex gap-2.5 px-6 py-4 border-t border-border max-sm:flex-col">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          placeholder="Добавить новую привычку..."
          maxLength={80}
          className="flex-1 px-4 py-3 min-h-[44px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
        />
        <button
          onClick={addHabit}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold min-h-[44px] bg-accent text-[#0f1115] rounded-sm cursor-pointer transition-all duration-300 hover:bg-accent-hover hover:-translate-y-0.5 shadow-[0_4px_20px_var(--accent-glow)] max-sm:justify-center"
        >
          + Добавить
        </button>
      </div>
    </div>
  );
}
