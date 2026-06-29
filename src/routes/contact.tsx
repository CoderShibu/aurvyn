import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Instagram, Linkedin, Mail, MessageSquare, Phone, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/GlassCard";
import { Reveal } from "@/components/site/Reveal";
import { FloatingInput, FloatingTextarea } from "@/components/site/FloatingField";
import { submitContactForm } from "@/lib/actions";
import { trackButtonClick, trackContactSubmission } from "@/components/site/AnalyticsProvider";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aurvyn" },
      { name: "description", content: "Get in touch with AURVYN. We'll respond within one business day." },
      { property: "og:title", content: "Contact — Aurvyn" },
      { property: "og:description", content: "Tell us about your brand. We'll respond within one business day." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid number").max(20),
  company: z.string().trim().min(1, "Brand name required").max(80),
  message: z.string().trim().min(10, "A bit more detail helps").max(1000),
});
type Data = z.infer<typeof schema>;

function ContactPage() {
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<Data>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (d: Data) => {
    setIsSubmitting(true);
    try {
      trackButtonClick("CONTACT_FORM_SUBMITTED");
      const res = await submitContactForm({ data: d });
      if (res.success) {
        trackContactSubmission(d.name);
        setDone(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches);
    trackButtonClick("PHONE_CALL_CLICKED");
    if (!isMobile) {
      e.preventDefault();
      navigator.clipboard.writeText("+916361063589");
      toast.success("Phone number copied to clipboard: +91 6361063589");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10">
      <Reveal>
        <div className="eyebrow">Contact</div>
        <h1 className="headline mt-4 max-w-4xl text-5xl sm:text-7xl">
          Let's see what growth <span className="text-gradient">looks like for you.</span>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="max-w-md text-lg leading-relaxed text-text-secondary">
            Tell us about your brand and where you want to be in 90 days. We respond within one
            business day — and if we're not the right team for the job, we'll say so.
          </p>

          <div className="mt-10 space-y-5">
            <ContactRow 
              icon={Mail} 
              label="Email" 
              value="aurvynn@gmail.com" 
              href="mailto:aurvynn@gmail.com" 
              onClick={() => trackButtonClick("EMAIL_CLICKED")}
            />
            <ContactRow 
              icon={Phone} 
              label="Call Now" 
              value="+91 6361063589" 
              href="tel:6361063589" 
              onClick={handlePhoneClick}
            />
            <ContactRow 
              icon={MessageSquare} 
              label="WhatsApp" 
              value="+91 6361063589" 
              href="https://wa.me/916361063589"
              external
              onClick={() => trackButtonClick("WHATSAPP_CLICKED")}
            />
            <ContactRow icon={Clock} label="Hours" value="Mon–Fri · 10:00–19:00 IST" />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <GlassCard interactive={false} className="p-8 sm:p-10">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center"
              >
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-brand text-white">
                  ✓
                </div>
                <div className="mt-6 font-display text-2xl tracking-tight">Message received.</div>
                <p className="mt-2 text-sm text-text-secondary">We'll reply within one business day.</p>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FloatingInput label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
                <FloatingInput label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
                <FloatingInput label="Phone" type="tel" {...form.register("phone")} error={form.formState.errors.phone?.message} />
                <FloatingInput label="Brand Name" {...form.register("company")} error={form.formState.errors.company?.message} />
                <FloatingTextarea label="Message" rows={5} {...form.register("message")} error={form.formState.errors.message?.message} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  onClick,
  external,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  external?: boolean;
}) {
  const Wrap: React.ElementType = href ? "a" : "div";
  return (
    <Wrap
      {...(href ? {
        href,
        onClick,
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      } : {})}
      className="group flex items-center gap-4 border-b border-white/[0.06] pb-5"
    >
      <div className="border-gradient-brand grid size-10 place-items-center rounded-full">
        <Icon className="size-4 text-text-primary" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-text-tertiary">{label}</div>
        <div className="mt-0.5 text-text-primary transition-colors group-hover:text-white">{value}</div>
      </div>
    </Wrap>
  );
}
