import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "./BookingProvider";
import { trackButtonClick } from "./AnalyticsProvider";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          height: scrolled ? 64 : 72,
          backgroundColor: scrolled ? "var(--bg-navbar)" : "rgba(5,5,5,0)",
          borderBottomColor: scrolled ? "var(--border-navbar)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "blur(0px)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b"
        style={{ WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : undefined }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="AURVYN Logo"
              className="h-7 w-auto object-contain"
              style={{ filter: "var(--logo-filter)" }}
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group relative px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  <span className={active ? "text-text-primary" : ""}>{l.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-brand"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-brand opacity-50 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => {
                trackButtonClick("BOOK_CALL_CLICKED", { section: "navbar" });
                open();
              }}
              className="border-gradient-brand group hidden rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-text-primary transition-colors md:inline-flex cursor-pointer"
            >
              <span className="relative">
                <span className="bg-gradient-brand bg-clip-text text-transparent transition-opacity duration-300 group-hover:opacity-0">
                  Book Strategy Call
                </span>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Book Strategy Call
                </span>
              </span>
              <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-text-primary md:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] md:hidden"
            style={{
              background: "var(--bg-surface)",
              opacity: 0.98,
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="AURVYN Logo"
                  className="h-7 w-auto object-contain"
                  style={{ filter: "var(--logo-filter)" }}
                />
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-2 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <nav className="flex flex-col px-6 pt-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={l.to}
                    className="block border-b border-white/5 py-5 font-display text-3xl tracking-tight"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setMobileOpen(false);
                  trackButtonClick("BOOK_CALL_CLICKED", { section: "mobile_navbar" });
                  open();
                }}
                className="mt-8 w-full rounded-full bg-gradient-brand py-4 text-sm font-medium uppercase tracking-[0.14em] text-white cursor-pointer"
              >
                Book Strategy Call
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
