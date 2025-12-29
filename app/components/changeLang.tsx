import { useLanguage } from "../context/LanguageContext";

export default function changeLanguage() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as "en" | "es");
  };

  return (
    <select
      name="language"
      id="language-select"
      value={locale}
      onChange={handleLanguageChange}
      className="absolute top-4 right-4 ml-auto w-fit rounded border border-white/30 bg-white/10 px-2 py-1 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
    >
      <option value="en" className="text-black">
        English
      </option>
      <option value="es" className="text-black">
        Español
      </option>
    </select>
  );
}
