import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, RevealGroup, itemVariants } from "@/components/site/Reveal";
import { processSteps, faqs } from "@/components/site/data";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — Aurvyn" },
      { name: "description", content: "How AURVYN builds growth: research, strategy, execution, optimization, scale. A five-step framework, applied to every engagement." },
      { property: "og:title", content: "Process — Aurvyn" },
      { property: "og:description", content: "How growth gets built. Five steps, one operating system." },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10">
        <Reveal>
          <div className="eyebrow">Process</div>
          <h1 className="headline mt-4 max-w-4xl text-5xl sm:text-7xl">
            How growth <span className="text-gradient">gets built.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            One operating system, repeated and refined for every brand we work with. No improvisation,
            no guesswork — and no two months that look the same.
          </p>
        </Reveal>
      </section>

      {/* TIMELINE */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="relative">
          {/* connector line */}
          <div className="pointer-events-none absolute left-[42px] top-4 h-[calc(100%-2rem)] w-px bg-white/[0.06] sm:left-[60px]" />
          <motion.div
            className="pointer-events-none absolute left-[42px] top-4 w-px origin-top bg-gradient-brand sm:left-[60px]"
            style={{ height: "calc(100% - 2rem)" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          <RevealGroup className="space-y-14" stagger={0.12}>
            {processSteps.map((s) => (
              <motion.div
                variants={itemVariants}
                key={s.n}
                className="relative grid grid-cols-[80px_1fr] gap-6 sm:grid-cols-[120px_1fr] sm:gap-10"
              >
                <div className="relative">
                  <span className="absolute left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-gradient-brand shadow-glow-md" />
                </div>
                <div className="relative">
                  <div className="text-gradient-outline absolute -top-6 right-0 select-none font-display text-[120px] leading-none sm:text-[160px]">
                    {s.n}
                  </div>
                  <div className="relative">
                    <div className="eyebrow">Step {s.n}</div>
                    <h3 className="headline mt-2 text-3xl sm:text-4xl">{s.title}</h3>
                    <p className="mt-4 max-w-xl text-text-secondary">{s.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">FAQ</div>
          <h2 className="headline mt-4 text-4xl sm:text-5xl">
            The questions we get <span className="text-gradient">before every call.</span>
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {faqs.map((f, i) => (
            <Faq key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-lg tracking-tight text-text-primary sm:text-xl">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-text-secondary"
        >
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-text-secondary">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
