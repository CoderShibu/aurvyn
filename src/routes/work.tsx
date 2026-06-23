import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/site/GlassCard";
import { Reveal, RevealGroup, itemVariants } from "@/components/site/Reveal";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { caseStudies, testimonials } from "@/components/site/data";
import { trackButtonClick } from "@/components/site/AnalyticsProvider";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Aurvyn" },
      { name: "description", content: "Proof, not promises. Case studies and client outcomes from AURVYN's growth engagements." },
      { property: "og:title", content: "Work — Aurvyn" },
      { property: "og:description", content: "Case studies, real numbers, real outcomes." },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [tIndex, setTIndex] = useState(0);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10">
        <Reveal>
          <div className="eyebrow">Work</div>
          <h1 className="headline mt-4 max-w-4xl text-5xl sm:text-7xl">
            Proof, <span className="text-gradient">not promises.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Four engagements, four different problems, one consistent operating model. Outcomes are
            measured in numbers — not impressions.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-10">
        <RevealGroup className="space-y-5">
          {caseStudies.map((c, i) => {
            const open = activeIndex === i;
            return (
              <motion.div variants={itemVariants} key={c.client}>
                <GlassCard interactive={false} className="overflow-hidden p-0">
                  <button
                    onClick={() => {
                      const next = open ? null : i;
                      setActiveIndex(next);
                      if (next !== null) {
                        trackButtonClick("CASE_STUDY_VIEWED", { client: c.client, industry: c.industry });
                      }
                    }}
                    className="flex w-full items-center justify-between gap-6 p-7 text-left sm:p-9"
                  >
                    <div>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-text-tertiary">
                        <span>{c.industry}</span>
                      </div>
                      <div className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">{c.client}</div>
                      <div className="mt-2 text-sm text-text-secondary">{c.hook}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-white/12 text-text-secondary"
                    >
                      <ChevronDown className="size-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06] px-7 pb-9 pt-8 sm:px-9">
                          <div className="grid gap-8 lg:grid-cols-3">
                            <Detail label="Challenge" body={c.challenge} />
                            <Detail label="Strategy" body={c.strategy} />
                            <Detail label="Execution" body={c.execution} />
                          </div>

                          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {c.results.map((stat, idx) => (
                              <Stat
                                key={idx}
                                label={stat.label}
                                v={stat.v}
                                suf={stat.suf}
                                decimals={stat.decimals}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </RevealGroup>
        <p className="mt-6 text-xs text-text-tertiary">
          Client visuals are placeholder. Real engagement assets are shared under NDA.
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">Testimonials</div>
          <h2 className="headline mt-4 text-4xl sm:text-5xl">
            What clients <span className="text-gradient">notice first.</span>
          </h2>
        </Reveal>

        <div className="relative mt-12">
          <div className="flex gap-5 overflow-hidden">
            {testimonials.map((t, i) => {
              const distance = Math.abs(i - tIndex);
              const visible = distance <= 1;
              if (!visible) return null;
              const isActive = i === tIndex;
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: isActive ? 1 : 0.5, x: 0, scale: isActive ? 1 : 0.96 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={"flex-1 " + (isActive ? "" : "hidden lg:block")}
                >
                  <GlassCard className="h-full p-8">
                    <div className="text-gradient-outline font-display text-7xl leading-none">"</div>
                    <p className="mt-2 text-lg leading-relaxed text-text-primary">{t.quote}</p>
                    <div className="mt-8 flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-full bg-gradient-brand font-display text-sm text-white">
                        {t.name.split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm text-text-primary">{t.name}</div>
                        <div className="text-xs text-text-tertiary">{t.role}</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => setTIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="group flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-text-primary"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer " +
                    (i === tIndex ? "w-8 bg-gradient-brand" : "w-1.5 bg-white/15 hover:bg-white/30")
                  }
                />
              ))}
            </div>
            <button
              onClick={() => setTIndex((prev) => (prev + 1) % testimonials.length)}
              className="group flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-text-primary"
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="eyebrow mb-3">{label}</div>
      <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">{body}</p>
    </div>
  );
}

function Stat({ label, v, suf, decimals }: { label: string; v: number; suf?: string; decimals?: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="font-display text-3xl tracking-tight">
        <span className="text-gradient">
          <AnimatedCounter value={v} suffix={suf} decimals={decimals} />
        </span>
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-text-tertiary">{label}</div>
    </div>
  );
}
