"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

export const ThemeContext = React.createContext({
  mode: "light" as "light" | "dark",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  // load saved mode
  React.useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved === "dark" || saved === "light") {
      setMode(saved);
    }
  }, []);

  const theme = React.useMemo(
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
