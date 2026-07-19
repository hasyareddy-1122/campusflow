"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Suppress the React 19 "script tag" warning in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const orig = console.error;
    console.error = (...args) => {
      if (args[0]?.includes("Encountered a script tag")) return;
      orig(...args);
    };
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Ensure this is exported as a named export
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    theme: resolvedTheme,
    toggleTheme,
  };
};
