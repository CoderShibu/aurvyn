import { useEffect, useState } from "react";

export type Theme = "dark" | "blue";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    // Migrate any previously stored "light" value to "dark"
    const initialTheme: Theme = stored === "blue" ? "blue" : "dark";
    setTheme(initialTheme);
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
    // Dispatch custom event so WebGL canvases can react instantly
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  return { theme, setTheme: changeTheme };
}
