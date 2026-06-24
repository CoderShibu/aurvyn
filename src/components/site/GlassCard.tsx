import { useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode; interactive?: boolean };

export function GlassCard({ children, className = "", interactive = true, onMouseMove, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={
        "glass-panel relative overflow-hidden " +
        (interactive ? "glass-panel-hover " : "") +
        className
      }
      {...rest}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--card-glow-color, rgba(255,148,178,0.15)), transparent 55%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
