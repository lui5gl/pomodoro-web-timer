import { useLanguage } from "../context/LanguageContext";

export default function handleLanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageClick = (newLocale: "en" | "es") => {
    setLocale(newLocale);
  };

  const itemClass = (active: boolean) =>
    `flex items-center justify-center rounded-xs px-2 cursor-pointer transition-all duration-200 ${
      active ? "bg-white text-red-800" : "text-white hover:bg-white/20"
    }`;

  return (
    <section className="absolute top-4 right-4 flex gap-2 font-bold">
      <div
        onClick={() => handleLanguageClick("en")}
        className={itemClass(locale === "en")}
      >
        EN
      </div>
      <div
        onClick={() => handleLanguageClick("es")}
        className={itemClass(locale === "es")}
      >
        ES
      </div>
    </section>
  );
}
