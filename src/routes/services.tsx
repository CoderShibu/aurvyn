import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/site/GlassCard";
import { Reveal, RevealGroup, itemVariants } from "@/components/site/Reveal";
import { LiveDashboard } from "@/components/site/LiveDashboard";
import { MagneticButton } from "@/components/site/MagneticButton";
import { services, type Service } from "@/components/site/data";
import { useBooking } from "@/components/site/BookingProvider";
import { trackButtonClick } from "@/components/site/AnalyticsProvider";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Aurvyn" },
      { name: "description", content: "Six engineered growth services: social media, performance marketing, personal branding, content strategy, community, and analytics." },
      { property: "og:title", content: "Services — Aurvyn" },
      { property: "og:description", content: "Six systems. One growth engine." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [active, setActive] = useState<Service | null>(null);
  const { open } = useBooking();

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10">
        <Reveal>
          <div className="eyebrow">Services</div>
          <h1 className="headline mt-4 max-w-4xl text-5xl sm:text-7xl">
            What we engineer. <span className="text-gradient">Six systems. One engine.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Every engagement is built around a system, not a deliverables list. Pick the surface that
            matters most to your business — we engineer it end to end.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.button
                variants={itemVariants}
                key={s.slug}
                onClick={() => {
                  trackButtonClick("SERVICE_CARD_OPENED", { service: s.name });
                  setActive(s);
                }}
                className="group text-left"
              >
                <motion.div layoutId={`card-${s.slug}`}>
                  <GlassCard className="h-full p-7">
                    <motion.div layoutId={`icon-${s.slug}`} className="border-gradient-brand mb-6 grid size-11 place-items-center rounded-full">
                      <Icon className="size-4 text-text-primary" strokeWidth={1.5} />
                    </motion.div>
                    <motion.div layoutId={`title-${s.slug}`} className="font-display text-xl tracking-tight text-text-primary">
                      {s.name}
                    </motion.div>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.oneLine}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-tertiary transition-colors group-hover:text-text-primary">
                      View details
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.button>
            );
          })}
        </RevealGroup>
      </section>

      {/* LIVE DASHBOARD */}
      <section className="mx-auto max-w-7xl px-6 pt-32 lg:px-10">
        <Reveal>
          <div className="eyebrow">Inside the engine</div>
          <h2 className="headline mt-4 max-w-3xl text-4xl sm:text-6xl">
            A live look at <span className="text-gradient">how we track what matters.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-text-secondary">
            Every client gets a working dashboard, not a quarterly PDF. Numbers in front, decisions
            traceable back to them.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10">
            <LiveDashboard />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <GlassCard interactive={false} className="p-10 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h3 className="headline text-3xl sm:text-4xl">
                  Not sure which system you need?
                </h3>
                <p className="mt-3 max-w-xl text-text-secondary">
                  Book a call. We'll map your current state, find the highest-leverage move, and tell
                  you which of the six systems should come first.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <MagneticButton onClick={() => {
                  trackButtonClick("BOOK_CALL_CLICKED", { section: "services_bottom" });
                  open();
                }}>
                  Book Strategy Call
                  <ArrowRight className="size-4" />
                </MagneticButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* SERVICE MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8"
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(18px) saturate(120%)", WebkitBackdropFilter: "blur(18px) saturate(120%)" }}
              onClick={() => setActive(null)}
            />
            <motion.div
              layoutId={`card-${active.slug}`}
              className="glass-panel relative z-10 w-full max-w-[640px] p-8 sm:p-10"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-text-tertiary transition-colors hover:bg-white/5 hover:text-text-primary cursor-pointer"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <motion.div layoutId={`icon-${active.slug}`} className="border-gradient-brand mb-6 grid size-12 place-items-center rounded-full">
                <active.icon className="size-4 text-text-primary" strokeWidth={1.5} />
              </motion.div>

              <motion.h3 layoutId={`title-${active.slug}`} className="headline text-3xl sm:text-4xl">
                {active.name}
              </motion.h3>
              <p className="mt-4 text-text-secondary">{active.description}</p>

              <div className="mt-8">
                <div className="eyebrow mb-4">What's in the system</div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {active.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-text-primary">
                      <span className="grid size-5 place-items-center rounded-full bg-gradient-brand">
                        <Check className="size-3 text-white" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="eyebrow mb-2">What this typically includes</div>
                <p className="text-sm leading-relaxed text-text-secondary">{active.includes}</p>
              </div>

              <button
                onClick={() => {
                  const s = active.name;
                  trackButtonClick("SERVICE_SELECTED", { service: s });
                  setActive(null);
                  setTimeout(() => open(s), 250);
                }}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm cursor-pointer"
              >
                Continue to booking
                <ArrowRight className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
