// src/components/ThemeToggleButton.tsx
import { useTheme } from "./useTheme";

const ThemeToggleBut = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="themeBut"
    >
      {theme =="light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggleBut;
