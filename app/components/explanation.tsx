"use client";


import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { IconDeviceDesktop, IconSun, IconMoon } from "@tabler/icons-react";

// Simple markdown renderer for h2, ol, and p
function Markdown({ text }: { text: string }) {
  return (
    <div className="prose prose-invert max-w-none text-white/90">
      {text.split(/\n\n/).map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-2xl font-bold mt-6 mb-2">
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        if (block.match(/^\d+\. /)) {
          // Ordered list
          const items = block.split(/\n/).filter(Boolean);
          return (
            <ol key={i} className="list-decimal list-inside ml-4">
              {items.map((item, idx) => (
                <li key={idx}>{item.replace(/^\d+\. /, "")}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="mb-2">
            {block}
          </p>
        );
      })}
    </div>
  );
}


export default function Explanation() {
  const { dict } = useLanguage();
  const [open, setOpen] = useState(false);
  const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system'); // Default to 'system'
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        setResolvedTheme(mq.matches ? 'dark' : 'light');
        const handler = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
      } else {
        setResolvedTheme(theme as 'light' | 'dark');
      }
    };
    updateTheme();
  }, [theme]);

  const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <button
        className="mt-6 rounded-xs bg-white/15 px-6 py-2 text-white/90 text-base font-medium hover:bg-white/25 transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        {dict.learnMore}
      </button>
      {open && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-stretch justify-stretch w-full h-full transition-colors duration-300 ${
            isDark ? 'bg-black/90' : 'bg-white/90'
          }`}
        >
          <div
            className={`relative flex-1 flex flex-col items-center justify-center w-full h-full px-2 sm:px-0 transition-colors duration-300 ${
              isDark ? 'bg-neutral-900' : 'bg-white'
            }`}
          >
            <button
              className={`absolute top-4 right-4 text-2xl font-bold transition-colors duration-200 ${
                isDark ? 'text-white/60 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 rounded-lg overflow-y-auto" style={{maxHeight: '90vh'}}>
              <div className="flex justify-between items-center mb-4">
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {dict.explanationTitle}
                </h1>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button
                      key={t}
                      className={`rounded p-2 text-sm font-medium border transition-colors duration-200 ${theme === t ? 'border-blue-500' : 'border-transparent'} ${isDark ? 'bg-neutral-800 text-white/80' : 'bg-neutral-200 text-neutral-800'}`}
                      onClick={() => toggleTheme(t)}
                      title={`${t.charAt(0).toUpperCase() + t.slice(1)} theme`}
                    >
                      {t === 'system' ? <IconDeviceDesktop size={16} /> : t === 'light' ? <IconSun size={16} /> : <IconMoon size={16} />}
                    </button>
                  ))}
                </div>
              </div>
              <Markdown text={dict.explanationWhat} />
              <Markdown text={dict.explanationOrigin} />
              <Markdown text={dict.explanationHow} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
