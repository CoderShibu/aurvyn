import { motion } from "framer-motion";
import { useMemo } from "react";

export function HeroBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 10,
        duration: 14 + Math.random() * 14,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        className="absolute right-[-10%] top-1/3 size-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--brand-glow), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute left-[-8%] top-[60%] size-[360px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--brand-glow-soft), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: "var(--bubble-color)",
            boxShadow: "0 0 12px var(--bubble-color)",
          }}
          animate={{ y: ["0vh", "-120vh"], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
