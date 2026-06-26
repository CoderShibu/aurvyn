import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBooking } from "./BookingProvider";
import { FloatingInput, FloatingTextarea, FloatingSelect } from "./FloatingField";
import { trackButtonClick } from "./AnalyticsProvider";
import { WHATSAPP_CONFIG } from "@/config/whatsapp";

// 1. WhatsApp Lead Validation Schema
const whatsappLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  brandName: z.string().trim().min(1, "Brand name required").max(80),
  website: z.string().trim().min(1, "Instagram profile or website URL required").max(200),
  service: z.string().min(1, "Select a service"),
  goal: z.string().trim().optional(),
});

type WhatsappLeadData = z.infer<typeof whatsappLeadSchema>;

// Dropdown Options matching the requirements
const servicesList = [
  "Social Media Management",
  "Personal Branding",
  "Creator Management",
  "Influencer Marketing",
  "Brand Strategy",
  "Content Creation",
  "Performance Marketing",
  "Paid Advertising",
  "Video Production",
  "Other",
];

// Helper to map services to dropdown items
const mapPresetService = (s?: string) => {
  if (!s) return "";
  const lowercase = s.toLowerCase();
  if (lowercase.includes("social media")) return "Social Media Management";
  if (lowercase.includes("personal branding")) return "Personal Branding";
  if (lowercase.includes("creator")) return "Creator Management";
  if (lowercase.includes("influencer")) return "Influencer Marketing";
  if (lowercase.includes("brand strategy") || lowercase.includes("strategy")) return "Brand Strategy";
  if (lowercase.includes("content strategy") || lowercase.includes("content creation")) return "Content Creation";
  if (lowercase.includes("performance marketing")) return "Performance Marketing";
  if (lowercase.includes("paid advertising") || lowercase.includes("ad")) return "Paid Advertising";
  if (lowercase.includes("video")) return "Video Production";
  return "Other";
};

type Stage = "form" | "processing" | "success";

export function BookingModal() {
  const { isOpen, close, service } = useBooking();
  const [stage, setStage] = useState<Stage>("form");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const whatsappForm = useForm<WhatsappLeadData>({
    resolver: zodResolver(whatsappLeadSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      brandName: "",
      website: "",
      service: "",
      goal: "",
    },
  });

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      const mappedService = mapPresetService(service);
      whatsappForm.reset({
        fullName: "",
        brandName: "",
        website: "",
        service: mappedService,
        goal: "",
      });
    } else {
      setTimeout(() => {
        setStage("form");
        setWhatsappUrl("");
        whatsappForm.reset();
      }, 300);
    }
  }, [isOpen, service, whatsappForm]);

  const onSubmit = async (data: WhatsappLeadData) => {
    setStage("processing");
    trackButtonClick("WHATSAPP_LEAD_SUBMITTED");

    // Clean country code and phone number (remove +, spaces, dashes)
    const countryCodeClean = WHATSAPP_CONFIG.countryCode.replace(/[+\s-]/g, "");
    const phoneNumberClean = WHATSAPP_CONFIG.phoneNumber.replace(/[+\s-]/g, "");
    const recipient = `${countryCodeClean}${phoneNumberClean}`;

    const message = `Hi! I came across AURVYN and I'm interested in working together.

My Name:
${data.fullName}

Brand Name:
${data.brandName}

Instagram/Website:
${data.website}

Service Interested In:
${data.service}

Goal:
${data.goal?.trim() || "Not specified"}

Looking forward to discussing further. 🚀`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${recipient}?text=${encodedMessage}`;
    setWhatsappUrl(url);

    // Simulate premium loader
    await new Promise((resolve) => setTimeout(resolve, 850));

    try {
      const newWindow = window.open(url, "_blank");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        console.warn("Popup blocked. Will require manual redirection via success screen.");
      }
    } catch (e) {
      console.error("Popup window open failed", e);
    }

    setStage("success");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(18px) saturate(120%)",
              WebkitBackdropFilter: "blur(18px) saturate(120%)",
            }}
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative z-10 w-full max-w-[560px] p-7 sm:p-9 transition-all duration-300"
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-2 text-text-tertiary transition-colors hover:bg-white/5 hover:text-text-primary cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {/* STAGE 1: FORM INPUTS */}
            {stage === "form" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <div className="eyebrow">Start Your Project</div>
                  <h2 className="headline mt-2 text-3xl">
                    Tell us about your brand and we'll continue on{" "}
                    <span className="text-gradient">WhatsApp</span>.
                  </h2>
                </div>

                <form
                  onSubmit={whatsappForm.handleSubmit(onSubmit)}
                  className="mt-8 space-y-6"
                >
                  <Section title="Project Details">
                    <FloatingInput
                      label="Your Name"
                      {...whatsappForm.register("fullName")}
                      error={whatsappForm.formState.errors.fullName?.message}
                    />
                    <FloatingInput
                      label="Brand Name"
                      {...whatsappForm.register("brandName")}
                      error={whatsappForm.formState.errors.brandName?.message}
                    />
                    <FloatingInput
                      label="Instagram Profile or Website URL"
                      {...whatsappForm.register("website")}
                      error={whatsappForm.formState.errors.website?.message}
                    />
                    <FloatingSelect
                      label="Service Interested In"
                      {...whatsappForm.register("service")}
                      error={whatsappForm.formState.errors.service?.message}
                    >
                      <option value="">Select a service</option>
                      {servicesList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </FloatingSelect>
                    <FloatingTextarea
                      label="Primary Goal (optional but recommended)"
                      placeholder="Tell us briefly what you want to achieve (e.g. grow brand awareness, generate more leads)."
                      rows={3}
                      {...whatsappForm.register("goal")}
                      error={whatsappForm.formState.errors.goal?.message}
                    />
                  </Section>

                  <button
                    type="submit"
                    disabled={whatsappForm.formState.isSubmitting || stage === "processing"}
                    className="relative w-full overflow-hidden rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Project on WhatsApp
                  </button>
                </form>
              </motion.div>
            )}

            {/* STAGE 2: PROCESSING SKELETON */}
            {stage === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative size-24">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--gradient-brand)",
                      filter: "blur(24px)",
                      opacity: 0.6,
                    }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full bg-gradient-brand"
                    animate={{ scale: [1, 0.92, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Loader2 className="absolute inset-0 m-auto size-6 animate-spin text-white" />
                </div>
                <div className="mt-8 font-display text-2xl tracking-tight">
                  Generating WhatsApp Link
                </div>
                <div className="mt-2 max-w-xs text-sm text-text-secondary">
                  Preparing your pre-filled inquiry. You'll be redirected to WhatsApp in a moment.
                </div>
              </motion.div>
            )}

            {/* STAGE 3: PREMIUM SUCCESS SCREEN */}
            {stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid size-20 place-items-center rounded-full bg-gradient-brand shadow-brand"
                >
                  <Check className="size-9 text-white" strokeWidth={2.5} />
                </motion.div>

                <h3 className="headline mt-7 text-3xl">Let's build together.</h3>
                <p className="mt-4 max-w-sm text-sm text-text-secondary leading-relaxed">
                  We are opening WhatsApp to continue your project setup. If the chat didn't open automatically, click the button below.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Open WhatsApp
                  <ArrowRight className="size-4" />
                </a>

                <button
                  onClick={close}
                  className="mt-6 rounded-full border border-white/12 px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-white/30 hover:text-text-primary cursor-pointer"
                >
                  Back to site
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="text-[10px] uppercase tracking-[0.22em] text-text-tertiary">
          {title}
        </div>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
