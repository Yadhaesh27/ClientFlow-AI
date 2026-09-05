import React, { createContext, useContext, useEffect, useState } from 'react';

export type ModeTheme = 'light' | 'dark';
export type ColorAccent = 'indigo' | 'blue' | 'emerald' | 'violet' | 'cyan' | 'amber';

interface ThemeContextType {
  theme: ModeTheme;
  toggleTheme: () => void;
  setTheme: (theme: ModeTheme) => void;
  accent: ColorAccent;
  setAccent: (accent: ColorAccent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ModeTheme>(() => {
    const saved = localStorage.getItem('clientflow_theme') as ModeTheme;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accent, setAccentState] = useState<ColorAccent>(() => {
    const saved = localStorage.getItem('clientflow_accent') as ColorAccent;
    if (['indigo', 'blue', 'emerald', 'violet', 'cyan', 'amber'].includes(saved)) return saved;
    return 'indigo';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('clientflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    localStorage.setItem('clientflow_accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ModeTheme) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: ColorAccent) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
