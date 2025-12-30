import { useLanguage } from "../context/LanguageContext";

interface HandleLanguageSwitchProps {
  currentState: "pomodoro" | "short-break" | "long-break" | "custom";
}

export default function handleLanguageSwitch({
  currentState,
}: HandleLanguageSwitchProps) {
  const { locale, setLocale } = useLanguage();

  const handleLanguageClick = (newLocale: "en" | "es") => {
    setLocale(newLocale);
  };

  const getTextColor = () => {
    switch (currentState) {
      case "pomodoro":
        return "text-red-900";
      case "short-break":
        return "text-sky-900";
      case "long-break":
        return "text-lime-900";
      case "custom":
        return "text-fuchsia-900";
      default:
        return "text-white";
    }
  };

  const itemClass = (active: boolean) =>
    `flex items-center justify-center rounded-xs px-2 cursor-pointer transition-all duration-200 ${
      active ? `bg-white ${getTextColor()}` : "text-white/80 hover:bg-white/10"
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
