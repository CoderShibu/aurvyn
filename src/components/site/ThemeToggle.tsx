import { useTheme, Theme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: any; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "blue", icon: Sparkles, label: "Blue" },
  ];

  return (
    <div className="relative flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] p-1 shadow-sm backdrop-blur-md dark:border-white/[0.08] light:border-black/[0.08] light:bg-black/[0.02]">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`relative rounded-full p-2 transition-colors duration-200 cursor-pointer ${
              active
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
            title={`${opt.label} Mode`}
            aria-label={`${opt.label} Mode`}
          >
            {active && (
              <motion.span
                layoutId="active-theme-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-brand opacity-20 shadow-[0_0_12px_rgba(242,68,85,0.15)]"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Icon className="size-4" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
