"use client";

import { useState, useCallback } from "react";
import AnimateIn from "@/components/ui/AnimateIn";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

interface FieldError {
  name: string;
  email: string;
  phone: string;
  goal: string;
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "", message: "" });
  const [errors, setErrors] = useState<FieldError>({ name: "", email: "", phone: "", goal: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const validate = useCallback((field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Введи своё имя";
        if (value.trim().length < 2) return "Имя слишком короткое";
        if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value.trim())) return "Только буквы, пробелы и дефисы";
        return "";
      case "email":
        if (!value.trim()) return "Введи email";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Некорректный email";
        return "";
      case "phone":
        if (value.trim() && !/^[+]?[\d\s()-]{7,18}$/.test(value.trim())) return "Некорректный номер телефона";
        return "";
      case "goal":
        if (!value) return "Выбери цель";
        return "";
      default:
        return "";
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field as keyof typeof form]) }));
  };

  const formatPhone = (value: string): string => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (digits.startsWith("7") && digits.length > 1) {
      let formatted = "+7";
      if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
      if (digits.length > 4) formatted += ") " + digits.slice(4, 7);
      if (digits.length > 7) formatted += "-" + digits.slice(7, 9);
      if (digits.length > 9) formatted += "-" + digits.slice(9, 11);
      return formatted;
    }
    return value;
  };

  const handlePhoneInput = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+7") || cleaned.startsWith("8") || cleaned.startsWith("7")) {
      handleChange("phone", formatPhone(cleaned));
    } else {
      handleChange("phone", value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      phone: validate("phone", form.phone),
      goal: validate("goal", form.goal),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, goal: true });

    if (!newErrors.name && !newErrors.email && !newErrors.phone && !newErrors.goal) {
      setShowToast(true);
      setForm({ name: "", email: "", phone: "", goal: "", message: "" });
      setTouched({});
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 min-h-[44px] bg-surface-input border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)] ${
      errors[field as keyof FieldError]
        ? "border-[#ff5252] shadow-[0_0_0_3px_rgba(255,82,82,0.1)]"
        : touched[field] && !errors[field as keyof FieldError] && form[field as keyof typeof form]
        ? "border-accent"
        : "border-border"
    }`;

  return (
    <>
      <section className="py-24 max-md:py-16 bg-surface-secondary transition-colors duration-300">
        <div className="max-w-container mx-auto px-6">
          <AnimateIn>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-center mb-2 tracking-tight">
              Обратная связь
            </h2>
          </AnimateIn>
          <AnimateIn delay={80}>
            <p className="text-center text-text-secondary text-[1.05rem] mb-12 max-w-[560px] mx-auto">
              Оставь заявку на персональный разбор — мы свяжемся в течение 24 часов
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            {/* Form */}
            <AnimateIn>
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
                    onBlur={() => handleBlur("name")}
                    placeholder="Как тебя зовут?"
                    className={inputClass("name")}
                  />
                  <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.name}</span>
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="example@mail.com"
                    className={inputClass("email")}
                  />
                  <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.email}</span>
                </div>

                {/* Phone */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+7 (___) ___-__-__"
                    className={inputClass("phone")}
                  />
                  <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.phone}</span>
                </div>

                {/* Goal */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Какая у тебя цель? *</label>
                  <select
                    value={form.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    onBlur={() => handleBlur("goal")}
                    className={`${inputClass("goal")} cursor-pointer`}
                  >
                    <option value="">Выбери цель</option>
                    <option value="audit">Пройти аудит продуктивности</option>
                    <option value="tracking">Запустить 30-дневный трекинг</option>
                    <option value="habits">Сформировать новые привычки</option>
                    <option value="consult">Получить консультацию</option>
                    <option value="other">Другое</option>
                  </select>
                  <span className="block text-[0.8rem] text-[#ff5252] mt-1.5 min-h-[18px]">{errors.goal}</span>
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Сообщение</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                    placeholder="Расскажи немного о себе и своих целях..."
                    className="w-full px-4 py-3 min-h-[80px] bg-surface-input border border-border rounded-sm text-text-primary font-sans text-[0.95rem] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-subtle)] resize-y"
                  />
                </div>

                <Button type="submit" full size="lg">
                  <span>🚀</span> Отправить заявку
                </Button>
              </form>
            </AnimateIn>

            {/* Contact Info */}
            <AnimateIn delay={100}>
              <div className="flex flex-col gap-5">
                <div className="bg-surface-card border border-border rounded-lg p-7">
                  <h3 className="text-[1.1rem] font-bold mb-5">Свяжись с нами</h3>
                  <div className="flex items-center gap-3.5 mb-4 min-h-[44px]">
                    <span className="text-[1.4rem]">✉️</span>
                    <div>
                      <span className="block text-[0.82rem] text-text-muted">Email</span>
                      <a href="mailto:hello@habitsync.io" className="text-[0.95rem] font-medium text-accent no-underline hover:text-accent-hover">
                        hello@habitsync.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 mb-4 min-h-[44px]">
                    <span className="text-[1.4rem]">💬</span>
                    <div>
                      <span className="block text-[0.82rem] text-text-muted">Telegram</span>
                      <a href="https://t.me/habitsync_dev" target="_blank" rel="noopener noreferrer" className="text-[0.95rem] font-medium text-accent no-underline hover:text-accent-hover">
                        @habitsync_dev
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                    <a href="https://t.me/habitsync_dev" target="_blank" rel="noopener noreferrer" title="Telegram" className="w-11 h-11 flex items-center justify-center border border-border rounded-sm text-text-secondary no-underline hover:text-accent hover:border-accent hover:bg-accent-subtle transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" title="VK" className="w-11 h-11 flex items-center justify-center border border-border rounded-sm text-text-secondary no-underline hover:text-accent hover:border-accent hover:bg-accent-subtle transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.305-.491.745-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
                    </a>
                  </div>
                </div>

                <div className="bg-accent-subtle border border-accent rounded-lg p-7 text-center">
                  <span className="text-[2.4rem] block mb-3">🎯</span>
                  <h4 className="text-[1.05rem] font-bold mb-2">Бесплатный мини-аудит</h4>
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    Пройди наши калькуляторы и чек-лист прямо сейчас — это бесплатно и займёт 3 минуты!
                  </p>
                  <Button href="/tools" size="sm">
                    Начать аудит
                  </Button>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      <Toast show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
