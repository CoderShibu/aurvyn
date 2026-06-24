import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBooking } from "./BookingProvider";
import { trackButtonClick } from "./AnalyticsProvider";

export function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  const { open } = useBooking();
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden"
          style={{ background: "linear-gradient(to top, var(--bg-primary-fade, rgba(5,5,5,0.95)), transparent)" }}
        >
          <button
            onClick={() => {
              trackButtonClick("BOOK_CALL_CLICKED", { section: "mobile_sticky" });
              open();
            }}
            className="w-full rounded-full bg-gradient-brand py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-brand cursor-pointer"
          >
            Book Strategy Call
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
