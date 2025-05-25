"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  dark: boolean;
  toggle: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  dark: true,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("darkTheme");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
      html.classList.remove("theme-light");
    } else {
      html.classList.remove("dark");
      html.classList.add("theme-light");
    }

    localStorage.setItem("darkTheme", String(dark));
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);