import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MessageSquare } from "lucide-react";
import { trackButtonClick } from "./AnalyticsProvider";

const services = [
  "Social Media Management",
  "Performance Marketing",
  "Personal Branding",
  "Content Strategy",
  "Community Building",
  "Analytics & Reporting",
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 py-20 md:grid-cols-4 lg:px-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="AURVYN Logo"
              className="h-7 w-auto object-contain"
              style={{ filter: "var(--logo-filter)" }}
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
            A digital growth company engineering attention, authority, and revenue for ambitious brands.
          </p>
          <div className="mt-6 flex items-center gap-3 text-text-tertiary">
            <a 
              href="mailto:aurvynn@gmail.com" 
              onClick={() => trackButtonClick("EMAIL_CLICKED")}
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-text-primary"
              title="Email Us"
            >
              <Mail className="size-4" />
            </a>
            <a 
              href="https://wa.me/916361063589" 
              onClick={() => trackButtonClick("WHATSAPP_CLICKED")}
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-text-primary"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="size-4" />
            </a>
            <a 
              href="https://www.instagram.com/aurvynn.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackButtonClick("INSTAGRAM_CLICKED")}
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-text-primary"
              title="Follow us on Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a href="#" className="rounded-full border border-white/10 p-2 transition-colors hover:text-text-primary"><Linkedin className="size-4" /></a>
          </div>
        </div>

        <div>
          <div className="eyebrow mb-5">Company</div>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><Link to="/about" className="transition-colors hover:text-text-primary">About</Link></li>
            <li><Link to="/process" className="transition-colors hover:text-text-primary">Process</Link></li>
            <li><span className="opacity-60">Careers · Soon</span></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Services</div>
          <ul className="space-y-3 text-sm text-text-secondary">
            {services.map((s) => (
              <li key={s}><Link to="/services" className="transition-colors hover:text-text-primary">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Resources</div>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><Link to="/work" className="transition-colors hover:text-text-primary">Case Studies</Link></li>
            <li><span className="opacity-60">Blog · Soon</span></li>
            <li><Link to="/contact" className="transition-colors hover:text-text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-text-tertiary md:flex-row md:items-center lg:px-10">
          <span className="flex flex-wrap items-center gap-1.5">
            © {new Date().getFullYear()}{" "}
            <img
              src="/logo.png"
              alt="AURVYN Logo"
              className="h-4.5 w-auto object-contain inline-block"
              style={{ filter: "var(--logo-filter)" }}
            />{" "}
            All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-text-primary">Privacy</a>
            <a href="#" className="transition-colors hover:text-text-primary">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
