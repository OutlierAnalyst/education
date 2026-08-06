import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Контакты — HabitSync",
  description: "Оставь заявку на персональный аудит продуктивности или свяжись с нами через Telegram и email.",
};

export default function ContactsPage() {
  return (
    <div className="pt-[72px]">
      <ContactForm />
    </div>
  );
}
