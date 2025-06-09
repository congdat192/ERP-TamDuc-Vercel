
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemeMode, ThemePreset } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme: Light mode + Purple-Blue preset (preset1)
const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  preset: 'preset1'
};

const STORAGE_KEY = 'erp-user-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme) as ThemeConfig;
        setTheme(parsedTheme);
        applyThemeToDOM(parsedTheme);
      } else {
        // First time user - apply default theme
        applyThemeToDOM(DEFAULT_THEME);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      applyThemeToDOM(DEFAULT_THEME);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
      applyThemeToDOM(theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  const applyThemeToDOM = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply theme mode class
    root.classList.remove('light', 'dark');
    root.classList.add(themeConfig.mode);
    
    // Apply theme preset class - only 2 presets now
    root.classList.remove('preset1', 'preset2');
    root.classList.add(themeConfig.preset);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setThemePreset = (preset: ThemePreset) => {
    setTheme(prev => ({ ...prev, preset }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeMode,
        setThemePreset,
        resetTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
