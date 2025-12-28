"use client";

import { useLanguage } from "../context/LanguageContext";

export default function ChangeLang() {
  const { locale, setLocale } = useLanguage();

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-1 text-xs font-bold transition-all duration-200 ${
      active
        ? "bg-white text-neutral-900 shadow-sm"
        : "text-neutral-50 hover:bg-white/20"
    }`;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-neutral-200/40 p-1 backdrop-blur-sm">
      <button
        onClick={() => setLocale("en")}
        className={buttonClass(locale === "en")}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("es")}
        className={buttonClass(locale === "es")}
      >
        ES
      </button>
    </div>
  );
}
