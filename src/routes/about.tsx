import { createFileRoute } from "@tanstack/react-router";
import { Compass, LineChart, Database, Layers } from "lucide-react";
import { Reveal, RevealGroup, itemVariants } from "@/components/site/Reveal";
import { GlassCard } from "@/components/site/GlassCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aurvyn" },
      { name: "description", content: "AURVYN is a digital growth company. Strategy-first, performance-driven, data-backed, built to scale." },
      { property: "og:title", content: "About — Aurvyn" },
      { property: "og:description", content: "Why we build systems, not campaigns." },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  { icon: Compass, title: "Strategy-First", body: "Every system starts with a framework, not a content calendar." },
  { icon: LineChart, title: "Performance-Driven", body: "We optimize for outcomes — leads, revenue, retention — not likes." },
  { icon: Database, title: "Data-Backed", body: "Decisions made on numbers, reviewed monthly, never on instinct alone." },
  { icon: Layers, title: "Built to Scale", body: "Systems designed to grow with you, not be rebuilt every quarter." },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-10">
        <Reveal>
          <div className="eyebrow">About</div>
          <h1 className="headline mt-4 max-w-5xl text-5xl sm:text-7xl lg:text-[88px]">
            We don't post content.
            <br />
            <span className="text-gradient">We build growth systems.</span>
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1.2fr_1fr] lg:px-10">
        <Reveal>
          <p className="text-lg leading-relaxed text-text-secondary">
            AURVYN was founded on a single idea: that growth — the kind that compounds, defends margin,
            and outlives a single campaign — is engineered. It is not the byproduct of posting more, or
            chasing whatever trend the platform rewards this week.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            We work with founders, operators, and brand teams who treat marketing as infrastructure.
            Our engagements look less like an agency retainer and more like an embedded growth
            function — pillars, dashboards, weekly cycles, monthly reviews.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            If you want a vendor that ships posts, we are not the right team. If you want a partner
            that builds the system those posts live inside, we should talk.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <GlassCard interactive={false} className="p-8">
            <div className="eyebrow">Operating principles</div>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary">
              <li><span className="text-text-primary">Numbers over narrative.</span> Every review starts with what the dashboard says, not what we hoped it would.</li>
              <li><span className="text-text-primary">Fewer, sharper bets.</span> We'd rather scale two formats that work than test ten that distract.</li>
              <li><span className="text-text-primary">Build, then defend.</span> A growth system that can't be maintained without us isn't a system. It's a dependency.</li>
              <li><span className="text-text-primary">Refuse the work that doesn't fit.</span> Bad fit clients are bad for them and bad for us.</li>
            </ul>
          </GlassCard>
        </Reveal>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">Why AURVYN</div>
          <h2 className="headline mt-4 max-w-3xl text-4xl sm:text-5xl">
            Four principles. <span className="text-gradient">Applied to every engagement.</span>
          </h2>
        </Reveal>
        <RevealGroup className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div variants={itemVariants} key={p.title} className="flex gap-5">
                <div className="border-gradient-brand grid size-12 shrink-0 place-items-center rounded-full">
                  <Icon className="size-4 text-text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-xl tracking-tight">{p.title}</div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </RevealGroup>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal>
          <div className="eyebrow">Team</div>
          <h2 className="headline mt-4 max-w-3xl text-4xl sm:text-5xl">
            A small bench, by <span className="text-gradient">design.</span>
          </h2>
          <p className="mt-5 max-w-xl text-text-secondary">
            Every account is led by a senior operator, not handed to a junior. We stay small on purpose
            — it's the only way the work stays this consistent.
          </p>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Founder & Growth Lead", "Performance Director", "Creative Director", "Analytics Lead"].map((role) => (
            <motion.div variants={itemVariants} key={role}>
              <GlassCard className="p-7">
                <div
                  aria-hidden
                  className="aspect-square w-full rounded-xl"
                  style={{ background: "var(--gradient-about-card)" }}
                />
                <div className="mt-5 font-display text-lg tracking-tight">Profile coming soon</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-text-tertiary">{role}</div>
              </GlassCard>
            </motion.div>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
