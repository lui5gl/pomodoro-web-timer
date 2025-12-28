"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../dictionaries/en.json";
import es from "../dictionaries/es.json";

type Locale = "en" | "es";
type Dictionary = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { en, es };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, dict: dictionaries[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
