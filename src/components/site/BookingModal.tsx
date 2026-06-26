import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Loader2,
  X,
  ArrowRight,
  Megaphone,
  User,
  Layers,
  Users,
  Send,
  BarChart3,
  Film,
  Brain,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBooking } from "./BookingProvider";
import { FloatingInput, FloatingTextarea } from "./FloatingField";
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

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Service items matching user's requested titles and descriptions
const servicesList: ServiceItem[] = [
  { id: "social-media", title: "Social Media Management", desc: "Daily content, strategy & community growth", icon: Megaphone },
  { id: "personal-branding", title: "Personal Branding", desc: "Build authority that people remember", icon: User },
  { id: "content-creation", title: "Content Creation", desc: "Creative production for every platform", icon: Layers },
  { id: "creator-management", title: "Creator Management", desc: "Brand deals, partnerships & career growth", icon: Users },
  { id: "influencer-marketing", title: "Influencer Marketing", desc: "Campaigns with creators that convert", icon: Send },
  { id: "performance-marketing", title: "Performance Marketing", desc: "Paid campaigns focused on ROI", icon: BarChart3 },
  { id: "video-production", title: "Video Production", desc: "Premium visuals and storytelling", icon: Film },
  { id: "brand-strategy", title: "Brand Strategy", desc: "Positioning, messaging & identity", icon: Brain },
  { id: "other", title: "Other", desc: "Tell us what you need", icon: Sparkles },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Screen size check for Mobile/Desktop layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll selected item into view when dropdown opens
  useEffect(() => {
    if (dropdownOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [dropdownOpen]);

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
      setDropdownOpen(false);
    } else {
      setTimeout(() => {
        setStage("form");
        setWhatsappUrl("");
        setDropdownOpen(false);
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

  const selectedService = whatsappForm.watch("service");

  const handleSelectService = (title: string) => {
    whatsappForm.setValue("service", title, { shouldValidate: true });
    setDropdownOpen(false);
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

                    {/* Custom Service Selector */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full text-left bg-transparent px-0 pb-2 pt-5 text-sm focus:outline-none cursor-pointer flex justify-between items-center peer"
                      >
                        <span className={selectedService ? "text-text-primary" : "text-text-tertiary"}>
                          {selectedService || "Select a service"}
                        </span>
                        <ChevronDown className={`size-4 text-text-tertiary transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-text-primary" : ""}`} />
                      </button>
                      <label className="pointer-events-none absolute left-0 top-0 text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                        Service Interested In
                      </label>
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/12" />
                      <span
                        className={
                          "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                          (dropdownOpen ? "scale-x-100 bg-gradient-brand " : " ") +
                          (whatsappForm.formState.errors.service ? "bg-[color:var(--color-destructive)] scale-x-100" : "")
                        }
                      />
                      {whatsappForm.formState.errors.service && (
                        <p className="mt-1.5 text-xs text-[color:var(--color-destructive)]">
                          {whatsappForm.formState.errors.service.message}
                        </p>
                      )}

                      {/* Desktop Dropdown Popover */}
                      <AnimatePresence>
                        {dropdownOpen && !isMobile && (
                          <>
                            {/* Backdrop click listener */}
                            <div
                              className="fixed inset-0 z-[85]"
                              onClick={() => setDropdownOpen(false)}
                            />

                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.96 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="absolute left-0 right-0 z-[90] mt-2 rounded-2xl p-2.5 max-h-[400px] overflow-y-auto selector-scrollbar flex flex-col gap-[14px] select-none"
                              style={{
                                background: "rgba(12, 12, 14, 0.88)",
                                backdropFilter: "blur(28px)",
                                WebkitBackdropFilter: "blur(28px)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                boxShadow:
                                  "0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 16px rgba(242, 68, 85, 0.04)",
                              }}
                            >
                              {servicesList.map((item) => {
                                const Icon = item.icon;
                                const isSelected = selectedService === item.title;
                                return (
                                  <button
                                    type="button"
                                    key={item.title}
                                    ref={isSelected ? activeItemRef : undefined}
                                    onClick={() => handleSelectService(item.title)}
                                    className={`group flex items-center gap-[14px] p-[18px] rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                                      isSelected
                                        ? "border-[rgba(242,68,85,0.7)] bg-white/[0.06] shadow-[inset_0_1px_12px_rgba(242,68,85,0.1)]"
                                        : "border-transparent bg-white/[0.02] hover:bg-white/[0.04] hover:border-[rgba(242,68,85,0.4)] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_-6px_rgba(242,68,85,0.12)]"
                                    }`}
                                  >
                                    <div
                                      className={`p-2.5 rounded-lg transition-all duration-300 ${
                                        isSelected
                                          ? "bg-brand-red/20 text-brand-rose"
                                          : "bg-white/5 text-text-secondary group-hover:text-text-primary group-hover:bg-white/10"
                                      }`}
                                    >
                                      <Icon className="size-[18px] transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[16px] font-semibold text-white tracking-tight">
                                        {item.title}
                                      </div>
                                      <div className="text-[13px] font-medium text-white/60 mt-1.5 leading-snug group-hover:text-white/80 transition-colors">
                                        {item.desc}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-brand-rose pr-1"
                                      >
                                        <Check className="size-4.5" strokeWidth={3.5} />
                                      </motion.div>
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

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

      {/* Mobile Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {dropdownOpen && isMobile && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDropdownOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            {/* Slide up Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 inset-x-0 rounded-t-[24px] p-6 pb-10 flex flex-col max-h-[85vh] overflow-hidden"
              style={{
                background: "rgba(13, 13, 13, 0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(242, 68, 85, 0.05)",
              }}
            >
              {/* Drag Handle & Close */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5 shrink-0" />
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h3 className="text-xl font-display font-semibold text-text-primary">
                    Select a Service
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    Which system do you want to start with?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 text-text-secondary hover:text-text-primary"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Service Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 selector-scrollbar">
                {servicesList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedService === item.title;
                  return (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() => handleSelectService(item.title)}
                      className={`w-full group flex items-center gap-[14px] p-[16px] rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-[rgba(242,68,85,0.7)] bg-white/[0.06] shadow-[inset_0_1px_12px_rgba(242,68,85,0.1)]"
                          : "border-transparent bg-white/[0.02] active:bg-white/[0.06]"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg transition-all duration-300 ${
                          isSelected ? "bg-brand-red/20 text-brand-rose" : "bg-white/5 text-text-secondary"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-white tracking-tight">
                          {item.title}
                        </div>
                        <div className="text-[12px] font-medium text-white/60 mt-1 leading-normal">
                          {item.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-brand-rose pr-1">
                          <Check className="size-4" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="text-[10px] uppercase tracking-[0.22em] text-text-tertiary">{title}</div>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
