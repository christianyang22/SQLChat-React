"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "es" | "en";

interface LocaleContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  lang: "es",
  setLang: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  return (
    <LocaleContext.Provider value={{ lang, setLang }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}