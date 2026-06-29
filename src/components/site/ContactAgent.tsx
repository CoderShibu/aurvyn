import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Instagram, Phone, Mail, MessageSquare, Bot } from "lucide-react";
import { trackButtonClick } from "./AnalyticsProvider";

const ACTIONS = [
  {
    id: "ai-agent",
    label: "Chat with AI Agent",
    sub: "Instant answers, 24/7",
    icon: Bot,
    href: "https://aistudio.instagram.com/ai/27981615764768916?utm_source=ai_agent",
    color: "from-[#a855f7]/20 to-[#6366f1]/20",
    border: "border-[#a855f7]/25",
    iconColor: "text-[#a855f7]",
    track: "AI_AGENT_CLICKED",
    external: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sub: "+91 63610 63589",
    icon: MessageSquare,
    href: "https://wa.me/916361063589",
    color: "from-[#25D366]/20 to-[#128C7E]/20",
    border: "border-[#25D366]/25",
    iconColor: "text-[#25D366]",
    track: "WHATSAPP_CLICKED",
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    sub: "@aurvynn.in",
    icon: Instagram,
    href: "https://www.instagram.com/aurvynn.in",
    color: "from-[#f09433]/20 via-[#e6683c]/20 to-[#dc2743]/20",
    border: "border-[#e6683c]/25",
    iconColor: "text-[#e6683c]",
    track: "INSTAGRAM_CLICKED",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    sub: "aurvynn@gmail.com",
    icon: Mail,
    href: "mailto:aurvynn@gmail.com",
    color: "from-[#f24455]/20 to-[#ff94b2]/20",
    border: "border-[#f24455]/25",
    iconColor: "text-[#f24455]",
    track: "EMAIL_CLICKED",
    external: false,
  },
  {
    id: "call",
    label: "Call",
    sub: "+91 63610 63589",
    icon: Phone,
    href: "tel:+916361063589",
    color: "from-[#38bdf8]/20 to-[#2563eb]/20",
    border: "border-[#38bdf8]/25",
    iconColor: "text-[#38bdf8]",
    track: "PHONE_CALL_CLICKED",
    external: false,
  },
];

export function ContactAgent() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {/* Action chips */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2.5"
          >
            {/* Header prompt */}
            <div className="mb-0.5 flex items-center gap-2 self-end rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/90 px-4 py-2.5 shadow-xl backdrop-blur-xl">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f24455] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#f24455]" />
              </span>
              <span className="text-xs font-medium text-text-secondary">
                How would you like to connect?
              </span>
            </div>

            {/* Action rows */}
            {ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={action.id}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    trackButtonClick(action.track as any);
                    setOpen(false);
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.055, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex items-center gap-3 self-end rounded-2xl border bg-gradient-to-r ${action.color} ${action.border} px-4 py-3 shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-xl`}
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-text-primary leading-tight">
                      {action.label}
                    </span>
                    <span className="text-[11px] text-text-tertiary leading-tight">
                      {action.sub}
                    </span>
                  </div>
                  <div className={`grid size-9 place-items-center rounded-xl bg-white/[0.06] ${action.iconColor}`}>
                    <Icon className="size-4" strokeWidth={1.8} />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className="relative grid size-14 place-items-center rounded-full bg-gradient-brand shadow-brand cursor-pointer"
        aria-label="Contact us"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-gradient-brand opacity-30" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-5 text-white" strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-5 text-white" strokeWidth={2.2} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
