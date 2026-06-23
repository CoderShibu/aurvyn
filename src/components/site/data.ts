import {
  Megaphone,
  TrendingUp,
  Sparkles,
  Layers,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  oneLine: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  includes: string;
};

export const services: Service[] = [
  {
    slug: "social-media-management",
    name: "Social Media Management",
    oneLine: "Content, scheduling, and community — run like a system, not a scramble.",
    description:
      "We replace ad-hoc posting with an editorial operation. Pillars, calendars, production, and community handled by a team that treats your channels like product surfaces.",
    icon: Megaphone,
    features: ["Content Planning", "Scheduling & Production", "Community Management", "Platform Growth"],
    includes:
      "Quarterly content strategy, monthly editorial calendar, weekly production cycles, DM/comment management, monthly performance review.",
  },
  {
    slug: "performance-marketing",
    name: "Performance Marketing",
    oneLine: "Paid acquisition engineered for measurable return, not vanity reach.",
    description:
      "Meta, Google, and platform-native ads structured around your funnel. We instrument tracking properly, test deliberately, and scale only what compounds.",
    icon: TrendingUp,
    features: ["Meta Ads", "Google Ads", "Lead Generation", "Conversion Tracking", "Retargeting"],
    includes:
      "Account audit, pixel and event setup, creative production, weekly optimization, monthly attribution review.",
  },
  {
    slug: "personal-branding",
    name: "Personal Branding",
    oneLine: "Turn founders and creators into category authorities.",
    description:
      "A positioning system for the person behind the brand. Narrative, content cadence, and platform-specific moves designed to build long-term authority.",
    icon: Sparkles,
    features: ["Positioning", "Content Strategy", "Audience Building", "Authority Development"],
    includes:
      "Positioning workshop, narrative framework, content engine, ghostwriting & editing, monthly growth review.",
  },
  {
    slug: "content-strategy",
    name: "Content Strategy",
    oneLine: "A content system that compounds instead of starting from zero every week.",
    description:
      "Pillars, formats, and distribution mapped to business goals. Less content, made better, deployed where it actually moves a number.",
    icon: Layers,
    features: ["Content Pillars", "Content Calendars", "Growth Strategy", "Platform Optimization"],
    includes:
      "Audience research, pillar architecture, format library, distribution plan, performance taxonomy.",
  },
  {
    slug: "community-building",
    name: "Community Building",
    oneLine: "Audiences that stay, engage, and buy again.",
    description:
      "Retention and loyalty systems that turn followers into a recurring asset — not a vanity number.",
    icon: Users,
    features: ["Audience Engagement", "Loyalty Systems", "Retention Strategies", "Community Growth"],
    includes:
      "Community blueprint, engagement playbooks, loyalty program design, lifecycle communications, retention analytics.",
  },
  {
    slug: "analytics-reporting",
    name: "Analytics & Reporting",
    oneLine: "No guesswork. Every decision traced back to a number.",
    description:
      "Clean dashboards, monthly performance reviews, competitor benchmarking, and a single source of truth for every channel you run.",
    icon: BarChart3,
    features: ["Monthly Reports", "KPI Tracking", "Growth Analysis", "Competitor Insights"],
    includes:
      "Custom dashboard, KPI definition, monthly executive review, quarterly competitor benchmark.",
  },
];

export const processSteps = [
  {
    n: "01",
    title: "Research",
    body: "We study your brand, audience, and competitive landscape before touching a single post.",
  },
  {
    n: "02",
    title: "Strategy",
    body: "A growth framework built around your specific numbers, not a generic playbook.",
  },
  {
    n: "03",
    title: "Execution",
    body: "Campaigns and content systems go live — built to scale, not just to launch.",
  },
  {
    n: "04",
    title: "Optimization",
    body: "Every system is tracked, tested, and refined against real performance data.",
  },
  {
    n: "05",
    title: "Scale",
    body: "What works gets expanded. What doesn't gets cut. Growth compounds.",
  },
];

export const caseStudies = [
  {
    client: "Primebook",
    industry: "EdTech / Student Technology",
    hook: "Amplified event visibility through live content coverage, audience engagement, and real-time storytelling.",
    challenge:
      "Primebook needed stronger digital visibility during a student-focused campaign. The objective was to maximize event awareness, increase online engagement, and keep the audience connected beyond the venue.",
    strategy:
      "Built a live-content framework around Instagram Stories, Reels, attendee interactions, and event highlights. Every major moment was documented and published in real time to sustain attention throughout the campaign.",
    execution:
      "— Live Instagram Story coverage\n— Real-time event updates\n— Short-form Reels production\n— Audience engagement stories\n— Event recap content\n— Community interaction management",
    results: [
      { label: "Reach", v: 2.8, suf: "×", decimals: 1 },
      { label: "Engagement", v: 3.6, suf: "×", decimals: 1 },
      { label: "Content Views", v: 12.4, suf: "K", decimals: 1 },
      { label: "Profile Visits Lift", v: 58, suf: "%" },
    ],
  },
  {
    client: "SHEIN",
    industry: "Fashion / D2C Retail",
    hook: "Executed a high-energy campus activation campaign that transformed attendees into active brand advocates through real-time social engagement and voucher-driven participation.",
    challenge:
      "SHEIN aimed to maximize brand visibility, audience participation, and social media buzz during a large-scale student event. The objective was to drive awareness at scale while creating measurable engagement both online and on-ground.",
    strategy:
      "Designed an audience-powered promotion system where attendees actively participated in the campaign through live social sharing, story amplification, and voucher-driven engagement. The focus was on turning event attendees into brand ambassadors throughout the activation.",
    execution:
      "— Brand Point of Contact (POC) for campaign operations\n— Coordinated audience engagement activities\n— Facilitated large-scale voucher distribution campaign\n— Managed real-time promotional content flow\n— Oversaw live social amplification throughout the event\n— Community-driven content activation strategy",
    results: [
      { label: "Vouchers Distributed", v: 10000, suf: "+" },
      { label: "Live Stories", v: 300, suf: "+" },
      { label: "Campaign Reach", v: 4.2, suf: "×", decimals: 1 },
      { label: "Brand Engagement Lift", v: 72, suf: "%" },
    ],
  },
  {
    client: "Fastrack",
    industry: "Lifestyle / Fragrance",
    hook: "Executed a large-scale experiential marketing campaign that combined product sampling, audience participation, and real-time social amplification to maximize awareness for Fastrack's fragrance launch.",
    challenge:
      "Fastrack wanted to create strong product awareness and encourage trial for its newly launched perfume range during a high-footfall student event. The objective was to generate both physical engagement and digital visibility simultaneously.",
    strategy:
      "Built a dual-channel activation strategy focused on product sampling and audience-driven social promotion. Attendees experienced the product firsthand while actively sharing event moments through live stories and branded content.",
    execution:
      "— Managed on-ground brand activation\n— Coordinated perfume sampling campaign\n— Audience engagement and participation drives\n— Real-time content amplification\n— Live event coverage and promotions\n— Community-led social sharing initiative",
    results: [
      { label: "Samples Distributed", v: 800, suf: "+" },
      { label: "Live Stories", v: 450, suf: "+" },
      { label: "Campaign Reach", v: 5.1, suf: "×", decimals: 1 },
      { label: "Brand Engagement Lift", v: 84, suf: "%" },
    ],
  },
];

export const testimonials = [
  {
    name: "Aarav Khanna",
    role: "Marketing Lead",
    quote: "They brought structure to our marketing. Before working with them, we were posting consistently but without direction. Within weeks, we had a clear strategy, content system, and measurable goals.",
  },
  {
    name: "Riya Sharma",
    role: "Brand Manager",
    quote: "What stood out was their ability to understand our audience. Every campaign felt intentional, and the engagement quality improved significantly. They became an extension of our team.",
  },
  {
    name: "Vikram Kapoor",
    role: "Founder",
    quote: "We expected content support. What we got was a complete growth framework. Their planning, execution, and communication made the entire process seamless from day one.",
  },
  {
    name: "Neha Mehta",
    role: "Growth Consultant",
    quote: "They don't chase vanity metrics. Every recommendation was backed by strategy and data. The difference wasn't just more reach—it was attracting the right audience consistently.",
  },
];

export const faqs = [
  {
    q: "How long before we see results?",
    a: "Foundations land in the first 30 days. Channel-level lift is typically visible in 60–90 days. Compounding revenue impact emerges in the 4–6 month window — and that is the timeline our retainers are designed around.",
  },
  {
    q: "What platforms do you support?",
    a: "Instagram, LinkedIn, YouTube, X, and TikTok on the organic side. Meta, Google, LinkedIn, and YouTube on paid. We don't run channels we can't measure or scale.",
  },
  {
    q: "Do you manage paid ads as well as organic content?",
    a: "Yes — and they are operated as one system, not two siloed teams. Creative, targeting, and measurement share the same brief.",
  },
  {
    q: "Can you help personal brands and founders, not just companies?",
    a: "Yes. Founder-led growth is one of the highest-leverage moves we deploy, and our personal branding engagement is built specifically for it.",
  },
  {
    q: "How does onboarding work?",
    a: "Week 1: research and audit. Week 2: strategy build. Week 3: production setup. Week 4: first systems live. You meet your dedicated growth lead in week one and stay with them for the engagement.",
  },
  {
    q: "What's included in monthly reporting?",
    a: "A live dashboard you can check any day, a written monthly review that traces every number back to a decision, and a working session with your growth lead to align on the next 30 days.",
  },
];
