"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext({
  mode: "light" as "light" | "dark",

  toggleTheme: () => {},
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved === "dark" || saved === "light") {
      setMode(saved);
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("theme-mode", next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
