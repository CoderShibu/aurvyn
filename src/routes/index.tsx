import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroBackground } from "@/components/site/HeroBackground";
import { LiveDashboard } from "@/components/site/LiveDashboard";
import { MagneticButton } from "@/components/site/MagneticButton";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { GlassCard } from "@/components/site/GlassCard";
import { Reveal, RevealGroup, itemVariants } from "@/components/site/Reveal";
import { useBooking } from "@/components/site/BookingProvider";
import { services } from "@/components/site/data";
import { motion } from "framer-motion";
import { trackButtonClick } from "@/components/site/AnalyticsProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurvyn" },
      { name: "description", content: "AURVYN builds attention, authority, and revenue for ambitious brands through social media, performance marketing, and strategic content systems." },
      { property: "og:title", content: "Aurvyn" },
      { property: "og:description", content: "A digital growth company. Systems over campaigns." },
    ],
  }),
  component: Home,
});

function Home() {
  const { open } = useBooking();

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-10">
        <HeroBackground />
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow inline-flex items-center gap-2"
            >
              <span className="size-1.5 rounded-full bg-gradient-brand" />
              Digital Growth Company · Est. 2024
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="headline mt-6 text-[clamp(48px,9vw,112px)]"
            >
              Growth Is
              <br />
              <span className="text-gradient">Engineered.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="mt-7 max-w-[520px] text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              AURVYN helps brands build attention, authority, and revenue through social media,
              performance marketing, and strategic content systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton onClick={() => {
                trackButtonClick("BOOK_CALL_CLICKED", { section: "hero" });
                open();
              }}>
                Book Strategy Call
                <ArrowRight className="size-4" />
              </MagneticButton>
              <Link to="/services">
                <MagneticButton variant="ghost">
                  Explore Services
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[430px] mx-auto lg:ml-auto lg:mr-0 w-full"
          >
            <div className="absolute -inset-8 -z-10 rounded-full" style={{ background: "radial-gradient(circle, rgba(242,68,85,0.20), transparent 60%)", filter: "blur(50px)" }} />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <LiveDashboard />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">Trusted by operators who count results</div>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-3">
          {[
            { v: 10, suf: "+", l: "Brands Scaled" },
            { v: 100, suf: "+", l: "Campaigns Managed" },
            { v: 50, suf: "M+", l: "Combined Reach" },
          ].map((s, i) => (
            <motion.div variants={itemVariants} key={i} className="border-l border-white/[0.08] pl-5">
              <div className="font-display text-4xl tracking-tight sm:text-5xl">
                <span className="text-gradient">
                  <AnimatedCounter value={s.v} suffix={s.suf} />
                </span>
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.16em] text-text-tertiary">{s.l}</div>
            </motion.div>
          ))}
        </RevealGroup>

        {/* Logo strip */}
        <div className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            className="flex w-max items-center gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          >
            {[...Array(2)].flatMap((_, k) =>
              ["Primebook", "Wishcare", "Bellavita", "The Man Company", "Shein", "Fastrack", "Beardo"].map(
                (n) => (
                  <span
                    key={`${k}-${n}`}
                    className="whitespace-nowrap font-display text-2xl tracking-[0.12em] text-text-tertiary opacity-50 transition-all duration-300 hover:text-text-primary hover:opacity-100"
                  >
                    {n.toUpperCase()}
                  </span>
                ),
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">What we engineer</div>
          <h2 className="headline mt-4 max-w-3xl text-5xl sm:text-6xl">
            Six systems. <span className="text-gradient">One growth engine.</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div variants={itemVariants} key={s.slug}>
                <Link to="/services" className="group block">
                  <GlassCard className="h-full p-7">
                    <div className="border-gradient-brand mb-6 grid size-11 place-items-center rounded-full">
                      <Icon className="size-4 text-text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="font-display text-xl tracking-tight text-text-primary">{s.name}</div>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.oneLine}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-tertiary transition-colors group-hover:text-text-primary">
                      Explore
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </RevealGroup>
      </section>

      {/* WHY (condensed) */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <h2 className="headline text-5xl sm:text-6xl lg:text-7xl">
              We don't post content.
              <br />
              <span className="text-gradient">We build growth systems.</span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-text-secondary">
              Strategy-first, performance-driven, data-backed, built to scale. Four principles that
              keep every engagement from drifting into the work of a Canva-template agency.
            </p>
          </div>
        </Reveal>
        <div className="mt-10">
          <Link to="/about" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
            Read our approach
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <Reveal>
          <GlassCard interactive={false} className="relative overflow-hidden p-10 sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-[420px] rounded-full" style={{ background: "radial-gradient(circle, rgba(242,68,85,0.25), transparent 60%)", filter: "blur(50px)" }} />
            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <div className="eyebrow">Next intake</div>
                <h3 className="headline mt-3 text-4xl sm:text-5xl">
                  Ready to make growth a <span className="text-gradient">system</span>?
                </h3>
                <p className="mt-5 max-w-xl text-text-secondary">
                  A 30-minute strategy call. We assess fit, surface the highest-leverage moves for your
                  brand, and tell you straight if we're not the right team for it.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <MagneticButton onClick={() => {
                  trackButtonClick("BOOK_CALL_CLICKED", { section: "cta_banner" });
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
    </>
  );
}
