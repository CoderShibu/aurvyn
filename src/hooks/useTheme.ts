import { useEffect, useState } from "react";

export type Theme = "dark" | "light" | "cyberpunk";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme = (localStorage.getItem("theme") as Theme) || "dark";
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
