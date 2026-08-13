"use client";

import { useState } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name: string;
  contact: string;
}

const initialForm = { name: "", contact: "", comment: "" };
const initialErrors: FieldErrors = { name: "", contact: "" };

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = { name: "", contact: "" };

    if (!form.name.trim()) {
      newErrors.name = "Введи своё имя";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Имя слишком короткое";
    }

    if (!form.contact.trim()) {
      newErrors.contact = "Укажи телефон или ссылку на соцсеть";
    }

    return newErrors;
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (newErrors.name || newErrors.contact) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({ ok: false, error: "Ошибка сервера" }));

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Не удалось отправить заявку, попробуйте позже");
        return;
      }

      setStatus("success");
      setForm(initialForm);
      setErrors(initialErrors);
    } catch {
      setStatus("error");
      setErrorMessage("Проблема с соединением. Проверь интернет и попробуй снова.");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 min-h-[44px] bg-surface-input border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)] ${
      hasError ? "border-[#ff5252] shadow-[0_0_0_3px_rgba(255,82,82,0.1)]" : "border-border"
    }`;

  const buttonLabel =
    status === "loading" ? "Отправляем…" : status === "success" ? "Заявка отправлена" : "Отправить заявку";

  return (
    <section className="py-24 max-md:py-16 transition-colors duration-300">
      <div className="max-w-container mx-auto px-6">
        <AnimateIn>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
            Оставить заявку
          </h2>
        </AnimateIn>
        <AnimateIn delay={80}>
          <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
            Заполни короткую форму — заявка сразу придёт нам в сообщения ВКонтакте
          </p>
        </AnimateIn>

        <AnimateIn>
          <div className="max-w-[560px] mx-auto">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-surface-card border border-border rounded-lg p-8 max-md:p-6"
            >
              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text-secondary mb-2">Имя *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Как тебя зовут?"
                  disabled={status === "loading"}
                  className={inputClass(!!errors.name)}
                />
                <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.name}</span>
              </div>

              {/* Contact */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Телефон или ссылка на соцсеть *
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  placeholder="+7 900 000-00-00 или vk.com/id123"
                  disabled={status === "loading"}
                  className={inputClass(!!errors.contact)}
                />
                <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.contact}</span>
              </div>

              {/* Comment */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text-secondary mb-2">Комментарий</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  rows={4}
                  placeholder="Расскажи, что тебя интересует..."
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 min-h-[80px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)] resize-y disabled:opacity-60"
                />
              </div>

              {status === "success" && (
                <div className="mb-5 px-4 py-3 rounded-sm bg-accent-subtle border border-accent text-sm text-text-primary">
                  ✅ Спасибо, заявка отправлена! Мы свяжемся с тобой в ближайшее время.
                </div>
              )}

              {status === "error" && (
                <div className="mb-5 px-4 py-3 rounded-sm bg-[rgba(255,82,82,0.08)] border border-[#ff5252] text-sm text-[#ff5252]">
                  ⚠️ {errorMessage}
                </div>
              )}

              <Button type="submit" full size="lg" disabled={status === "loading"}>
                {status === "loading" ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>🚀</span>
                )}
                {buttonLabel}
              </Button>
            </form>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
