import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X, ArrowRight, Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useBooking } from "./BookingProvider";
import { FloatingInput, FloatingTextarea, FloatingSelect } from "./FloatingField";
import { Calendar } from "@/components/ui/calendar";
import { submitServiceBooking, scheduleDiscoveryCall } from "@/lib/actions";
import { trackButtonClick, trackServiceInquiry, trackDiscoveryCall } from "./AnalyticsProvider";

// 1. Service Booking Schema
const serviceSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  brandName: z.string().trim().min(1, "Brand name required").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z.string().trim().min(7, "Enter a valid number").max(20),
  location: z.string().trim().min(1, "Location required").max(100),
  budget: z.string().min(1, "Select a budget range"),
  description: z.string().trim().min(10, "A bit more detail helps").max(1000),
});
type ServiceFormData = z.infer<typeof serviceSchema>;

// 2. Strategy Call Schema (Step 1)
const strategyDetailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  brandName: z.string().trim().min(1, "Brand name required").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z.string().trim().min(7, "Enter a valid number").max(20),
  location: z.string().trim().min(1, "Location required").max(100),
});
type StrategyDetailsData = z.infer<typeof strategyDetailsSchema>;

const budgets = ["Under ₹50k", "₹50k – ₹2L", "₹2L – ₹5L", "₹5L+"];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

type Stage = "form" | "calendar" | "processing" | "success";

export function BookingModal() {
  const { isOpen, close, service } = useBooking();
  const [stage, setStage] = useState<Stage>("form");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Strategy Step 1 cached data
  const [strategyDetails, setStrategyDetails] = useState<StrategyDetailsData | null>(null);

  // Success screen data
  const [successData, setSuccessData] = useState<{
    meetLink?: string;
    dateStr?: string;
    timeSlot?: string;
  } | null>(null);

  // Separate forms for service booking and strategy call details
  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: "onBlur",
  });

  const strategyForm = useForm<StrategyDetailsData>({
    resolver: zodResolver(strategyDetailsSchema),
    mode: "onBlur",
  });

  // Reset modal state on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStage("form");
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
        setStrategyDetails(null);
        setSuccessData(null);
        serviceForm.reset();
        strategyForm.reset();
      }, 300);
    }
  }, [isOpen, serviceForm, strategyForm]);

  // Handle Strategy details submission (Step 1)
  const onStrategyDetailsSubmit = (data: StrategyDetailsData) => {
    trackButtonClick("STRATEGY_DETAILS_NEXT");
    setStrategyDetails(data);
    setStage("calendar");
  };

  // Handle Service Booking submission
  const onServiceSubmit = async (data: ServiceFormData) => {
    setStage("processing");
    trackButtonClick("SERVICE_BOOKING_SUBMITTED");
    try {
      const res = await submitServiceBooking({
        data: {
          name: data.fullName,
          brandName: data.brandName,
          phone: data.phone,
          email: data.email,
          location: data.location,
          serviceSelected: service || "General System",
          budget: data.budget,
          description: data.description,
        },
      });

      if (res.success) {
        trackServiceInquiry(service || "General System", data.budget);
        setStage("success");
      } else {
        toast.error("Failed to submit service inquiry. Please try again.");
        setStage("form");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
      setStage("form");
    }
  };

  // Handle Discovery Call submission (Step 2 Calendar)
  const handleScheduleCall = async () => {
    if (!selectedDate) {
      toast.error("Please select a date on the calendar.");
      return;
    }
    if (!selectedTimeSlot) {
      toast.error("Please select an available time slot.");
      return;
    }
    if (!strategyDetails) {
      toast.error("Contact details are missing. Please restart.");
      setStage("form");
      return;
    }

    setStage("processing");
    trackButtonClick("DISCOVERY_CALL_CONFIRMED");

    // Format date as YYYY-MM-DD local timezone
    const offset = selectedDate.getTimezoneOffset();
    const localDate = new Date(selectedDate.getTime() - offset * 60 * 1000);
    const dateStr = localDate.toISOString().split("T")[0];

    try {
      const res = await scheduleDiscoveryCall({
        data: {
          name: strategyDetails.fullName,
          brandName: strategyDetails.brandName,
          phone: strategyDetails.phone,
          email: strategyDetails.email,
          location: strategyDetails.location,
          dateStr,
          timeSlot: selectedTimeSlot,
        },
      });

      if (res.success) {
        trackDiscoveryCall(`${dateStr} ${selectedTimeSlot}`);
        setSuccessData({
          meetLink: res.meetLink,
          dateStr: res.dateStr,
          timeSlot: res.timeSlot,
        });
        setStage("success");
      } else {
        toast.error("Failed to schedule meeting. Please try again.");
        setStage("calendar");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred scheduling your call. Please try again.");
      setStage("calendar");
    }
  };

  const isServiceBooking = !!service;

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
            className={`glass-panel relative z-10 w-full p-7 sm:p-9 transition-all duration-300 ${
              stage === "calendar" ? "max-w-[760px]" : "max-w-[560px]"
            }`}
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
                  <div className="eyebrow">
                    {isServiceBooking ? "Service inquiry" : "Book strategy call"}
                  </div>
                  <h2 className="headline mt-2 text-3xl">
                    {isServiceBooking ? (
                      <>
                        Let's engineer your <span className="text-gradient">growth system</span>.
                      </>
                    ) : (
                      <>
                        Schedule your <span className="text-gradient">strategy call</span>.
                      </>
                    )}
                  </h2>
                  {isServiceBooking && (
                    <p className="mt-3 text-sm text-text-secondary">
                      Interested in <span className="text-text-primary font-medium">{service}</span>.
                    </p>
                  )}
                </div>

                {isServiceBooking ? (
                  /* Form for Service Booking */
                  <form
                    onSubmit={serviceForm.handleSubmit(onServiceSubmit)}
                    className="mt-8 space-y-6"
                  >
                    <Section title="Contact Details">
                      <FloatingInput
                        label="Full name"
                        {...serviceForm.register("fullName")}
                        error={serviceForm.formState.errors.fullName?.message}
                      />
                      <FloatingInput
                        label="Brand / Company name"
                        {...serviceForm.register("brandName")}
                        error={serviceForm.formState.errors.brandName?.message}
                      />
                      <FloatingInput
                        label="Email address"
                        type="email"
                        {...serviceForm.register("email")}
                        error={serviceForm.formState.errors.email?.message}
                      />
                      <FloatingInput
                        label="Contact phone number"
                        type="tel"
                        {...serviceForm.register("phone")}
                        error={serviceForm.formState.errors.phone?.message}
                      />
                      <FloatingInput
                        label="Location (City, Country)"
                        {...serviceForm.register("location")}
                        error={serviceForm.formState.errors.location?.message}
                      />
                    </Section>

                    <Section title="Project Details">
                      <FloatingSelect
                        label="Monthly marketing budget"
                        {...serviceForm.register("budget")}
                        error={serviceForm.formState.errors.budget?.message}
                      >
                        <option value="">Select budget range</option>
                        {budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </FloatingSelect>

                      <FloatingTextarea
                        label="Project description & goals"
                        placeholder="Tell us briefly about your brand and what growth looks like for you."
                        rows={4}
                        {...serviceForm.register("description")}
                        error={serviceForm.formState.errors.description?.message}
                      />
                    </Section>

                    <button
                      type="submit"
                      className="relative w-full overflow-hidden rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Submit inquiry
                    </button>
                  </form>
                ) : (
                  /* Form for Discovery Call Details */
                  <form
                    onSubmit={strategyForm.handleSubmit(onStrategyDetailsSubmit)}
                    className="mt-8 space-y-6"
                  >
                    <Section title="Contact Details (Required)">
                      <FloatingInput
                        label="Full name"
                        {...strategyForm.register("fullName")}
                        error={strategyForm.formState.errors.fullName?.message}
                      />
                      <FloatingInput
                        label="Brand / Company name"
                        {...strategyForm.register("brandName")}
                        error={strategyForm.formState.errors.brandName?.message}
                      />
                      <FloatingInput
                        label="Email address"
                        type="email"
                        {...strategyForm.register("email")}
                        error={strategyForm.formState.errors.email?.message}
                      />
                      <FloatingInput
                        label="Contact phone number"
                        type="tel"
                        {...strategyForm.register("phone")}
                        error={strategyForm.formState.errors.phone?.message}
                      />
                      <FloatingInput
                        label="Location (City, Country)"
                        {...strategyForm.register("location")}
                        error={strategyForm.formState.errors.location?.message}
                      />
                    </Section>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Next: Choose Date & Time
                      <ArrowRight className="size-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* STAGE 2: STRATEGY CALENDAR SELECTOR */}
            {stage === "calendar" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <button
                    onClick={() => setStage("form")}
                    className="text-xs uppercase tracking-[0.16em] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5 mb-2 cursor-pointer"
                  >
                    ← Back to Details
                  </button>
                  <h2 className="headline text-2xl sm:text-3xl">
                    Select <span className="text-gradient">Date & Time Slot</span>
                  </h2>
                  <p className="text-xs text-text-secondary mt-1">
                    Select a date and choose an available 30-min strategy session slot.
                  </p>
                </div>

                <div className="mt-7 grid gap-6 md:grid-cols-[1fr_240px]">
                  {/* Calendar component */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => {
                        setSelectedDate(d);
                        setSelectedTimeSlot(null); // Reset timeslot on date change
                      }}
                      disabled={{ before: new Date() }}
                      className="border-0 bg-transparent rounded-none"
                    />
                  </div>

                  {/* Time slots */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.16em] text-text-tertiary font-semibold">
                      <Clock className="size-3.5 text-text-tertiary" />
                      Available slots
                    </div>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:overflow-y-auto md:max-h-[280px] pr-1">
                        {TIME_SLOTS.map((slot) => {
                          const active = selectedTimeSlot === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`rounded-xl border py-3 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                active
                                  ? "border-transparent bg-gradient-brand text-white shadow-timeslot"
                                  : "border-white/10 text-text-secondary bg-white/[0.01] hover:border-white/25 hover:text-text-primary"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-text-tertiary">
                        <CalendarIcon className="size-6 mb-2 opacity-50" />
                        <p className="text-xs">Select a date to unlock slots</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScheduleCall}
                  className="mt-8 relative w-full overflow-hidden rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand-sm transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Schedule Call (Google Meet)
                </button>
              </motion.div>
            )}

            {/* STAGE 3: PROCESSING SKELETON */}
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
                  {isServiceBooking ? "Entering growth system" : "Generating calendar invite"}
                </div>
                <div className="mt-2 max-w-xs text-sm text-text-secondary">
                  {isServiceBooking
                    ? "Dispatching request to AURVYN master lead engine."
                    : "Connecting Google Meet, building invite calendar events."}
                </div>
              </motion.div>
            )}

            {/* STAGE 4: PREMIUM SUCCESS SCREEN */}
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

                {isServiceBooking ? (
                  <>
                    <h3 className="headline mt-7 text-3xl">Strategic Request Received.</h3>
                    <p className="mt-4 max-w-sm text-sm text-text-secondary leading-relaxed">
                      "Your strategic request has entered the AURVYN system. We'll contact you shortly."
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="headline mt-7 text-3xl">Discovery call scheduled.</h3>
                    <p className="mt-3 max-w-sm text-sm text-text-secondary leading-relaxed">
                      "Discovery call scheduled successfully. We'll contact you shortly."
                    </p>

                    {/* Show meeting details if generated */}
                    {successData && (
                      <div className="mt-6 w-full max-w-xs rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                          Meeting appointment
                        </div>
                        <div className="mt-2 font-display text-sm font-semibold text-text-primary">
                          {successData.dateStr}
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          At {successData.timeSlot} (IST)
                        </div>
                        <div className="h-px bg-white/[0.06] my-3" />
                        <a
                          href={successData.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-medium text-text-primary hover:bg-white/10 transition-colors"
                        >
                          <Video className="size-4 text-text-primary" />
                          Join Google Meet
                        </a>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={close}
                  className="mt-8 rounded-full border border-white/12 px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-white/30 hover:text-text-primary cursor-pointer"
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
