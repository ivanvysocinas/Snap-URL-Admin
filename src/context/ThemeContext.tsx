"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setSpecificTheme: (theme: Theme) => void;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider component that manages light/dark theme state
 * Persists theme preference in localStorage and respects system preference
 */
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by waiting for client-side mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setTheme(savedTheme);
      } else {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        setTheme(systemTheme);
      }
    } catch (error) {
      // Fallback if localStorage is not available
      setTheme("dark");
    }

    setMounted(true);
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = (): void => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Unable to save theme to localStorage:", error);
    }
  };

  /**
   * Set specific theme
   */
  const setSpecificTheme = (newTheme: Theme): void => {
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Unable to save theme to localStorage:", error);
    }
  };

  // Apply theme class to document root
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    let mediaQuery: MediaQueryList | null = null;
    let handleChange: ((e: MediaQueryListEvent) => void) | null = null;

    try {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      handleChange = (e: MediaQueryListEvent): void => {
        const hasStoredTheme = localStorage.getItem("theme");
        if (!hasStoredTheme) {
          setTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
    } catch (error) {
      console.warn("Unable to set up system theme listener:", error);
    }

    return () => {
      if (mediaQuery && handleChange) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, [mounted]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setSpecificTheme,
    isDark: theme === "dark",
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={mounted ? theme : "dark"} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * Safe theme hook that doesn't throw errors
 * Returns default values if used outside provider
 */
export const useSafeTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    return {
      theme: "dark",
      toggleTheme: () => {},
      setSpecificTheme: () => {},
      isDark: true,
      mounted: false,
    };
  }

  return context;
};
