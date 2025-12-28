"use client";

import { useLanguage } from "../context/LanguageContext";

export default function ChangeLang() {
  const { locale, setLocale } = useLanguage();

  const changeTo = locale === "en" ? "es" : "en";

  const handleChangeLang = () => {
    setLocale(changeTo);
  };

  return (
    <button
      onClick={handleChangeLang}
      className="rounded p-2 hover:bg-white/10 transition-colors"
    >
      {changeTo.toUpperCase()}
    </button>
  );
}
