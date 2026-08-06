"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

const weekData = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  values: [62, 85, 73, 90, 68, 55, 78],
};

type ChartType = "bar" | "line";

export default function WeeklyChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const avg = Math.round(weekData.values.reduce((a, b) => a + b, 0) / weekData.values.length);
  const maxIdx = weekData.values.indexOf(Math.max(...weekData.values));

  const getColors = useCallback(() => {
    const isDark = theme === "dark";
    return {
      grid: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      text: isDark ? "#8b8fa3" : "#5f6377",
      accent: isDark ? "#00e676" : "#00c853",
      accentTeal: "#00bcd4",
      accentGlow: isDark ? "rgba(0,230,118,0.3)" : "rgba(0,200,83,0.2)",
      barBg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      dotCenter: isDark ? "#1c1f28" : "#ffffff",
    };
  }, [theme]);

  const drawChart = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const colors = getColors();
      const padding = { top: 20, right: 20, bottom: 40, left: 40 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = colors.text;
        ctx.font = "11px Manrope, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(String(100 - i * 25), padding.left - 8, y + 4);
      }
      ctx.setLineDash([]);

      const barWidth = chartW / weekData.labels.length;

      function roundRect(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) {
        if (h < 0) { y += h; h = -h; }
        r = Math.min(r, w / 2, h / 2);
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      }

      if (chartType === "bar") {
        weekData.values.forEach((val, i) => {
          const x = padding.left + barWidth * i + barWidth * 0.2;
          const bw = barWidth * 0.6;
          const barH = (val / 100) * chartH * progress;
          const y = padding.top + chartH - barH;

          ctx.fillStyle = colors.barBg;
          ctx.beginPath();
          roundRect(ctx, x, padding.top, bw, chartH, 6);
          ctx.fill();

          const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
          grad.addColorStop(0, colors.accent);
          grad.addColorStop(1, colors.accentTeal);
          ctx.fillStyle = grad;
          ctx.beginPath();
          roundRect(ctx, x, y, bw, barH, 6);
          ctx.fill();

          if (progress >= 1) {
            ctx.fillStyle = colors.accent;
            ctx.font = "12px Manrope, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(val + "%", x + bw / 2, y - 8);
          }
        });
      } else {
        ctx.beginPath();
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        const points: { x: number; y: number; val: number }[] = [];
        weekData.values.forEach((val, i) => {
          const x = padding.left + barWidth * i + barWidth / 2;
          const barH = (val / 100) * chartH * progress;
          const y = padding.top + chartH - barH;
          points.push({ x, y, val });
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        areaGrad.addColorStop(0, colors.accentGlow);
        areaGrad.addColorStop(1, "transparent");
        ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
        ctx.lineTo(points[0].x, padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = areaGrad;
        ctx.fill();

        points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = colors.accent;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = colors.dotCenter;
          ctx.fill();

          if (progress >= 1) {
            ctx.fillStyle = colors.accent;
            ctx.font = "12px Manrope, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.val + "%", p.x, p.y - 14);
          }
        });
      }

      // X labels
      ctx.fillStyle = colors.text;
      ctx.font = "12px Manrope, sans-serif";
      ctx.textAlign = "center";
      weekData.labels.forEach((label, i) => {
        const x = padding.left + barWidth * i + barWidth / 2;
        ctx.fillText(label, x, h - padding.bottom + 24);
      });
    },
    [chartType, getColors]
  );

  const animateChart = useCallback(() => {
    const duration = 800;
    const start = performance.now();
    function frame(now: number) {
      let p = Math.min((now - start) / duration, 1);
      p = 1 - Math.pow(1 - p, 3);
      drawChart(p);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [drawChart]);

  useEffect(() => {
    if (!mounted) return;
    animateChart();

    const handleResize = () => drawChart(1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted, animateChart, drawChart]);

  useEffect(() => {
    if (mounted) animateChart();
  }, [chartType, theme, mounted, animateChart]);

  return (
    <div className="bg-surface-card border border-border rounded-lg overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <h3 className="text-[1.05rem] font-bold">📊 Динамика за неделю</h3>
        <div className="flex gap-1 bg-surface-input rounded-sm p-[3px]">
          {(["bar", "line"] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 min-h-[44px] text-sm font-medium border-none cursor-pointer rounded-md font-sans flex items-center transition-all duration-300 ${
                chartType === type
                  ? "bg-surface-card text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                  : "bg-transparent text-text-secondary"
              }`}
            >
              {type === "bar" ? "Столбцы" : "Линия"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 py-4">
        <canvas ref={canvasRef} className="w-full" style={{ height: "280px" }} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px bg-border border-t border-border">
        {[
          { value: `${avg}%`, label: "Средняя продуктивность" },
          { value: weekData.labels[maxIdx], label: "Лучший день" },
          { value: "5 дней", label: "Текущая серия" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-card py-4 px-4 text-center">
            <span className="block text-[1.15rem] font-bold text-accent">{stat.value}</span>
            <span className="block text-[0.82rem] text-text-muted mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
