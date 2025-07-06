// src/theme/useTheme.ts
import { useThemeContext } from "./ThemeProvider";

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeContext();
  return { theme, toggleTheme };
};
