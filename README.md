# Aurvyn — Digital Growth, Engineered.

Aurvyn is a high-performance, premium web application built for **Aurvyn**, a digital growth company engineering attention, authority, and revenue for ambitious brands through social media, performance marketing, and strategic content systems.

This repository hosts the front-of-house engine, interactive analytics client interface, and serverless backend pipelines that capture leads, schedule strategy consultations, dispatch WhatsApp alerts, and route email confirmations.

---

## 🛠️ Tech Stack & Architecture

The application is engineered with a modern, high-performance web stack:

- **Framework**: [React 19](https://react.dev/) & [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (a full-stack, React-Suspense-native SSR framework built on top of Vite and TanStack Router).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for sleek layouts, harmony-tailored colors, and glassmorphism panels.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for micro-interactions, responsive transition enters, and reveal states.
- **Charts**: [Recharts](https://recharts.org/) for real-time statistical area chart visualizer.
- **Icons**: [Lucide React](https://lucide.dev/) for minimalist, responsive iconography.

---

## 🚀 Key Features

### 1. 📊 Interactive Live Analytics Dashboard
A Stripe/Linear/Vercel-inspired dashboard that gives visitors a live look at how campaigns are tracked:
- **Responsive 2x2 Metrics**: Showcases custom metrics (Audience Growth, Engagement Rate, Ad Volume, Conversion Rate) optimized to prevent overlapping text.
- **Full-Width Platform Progress**: Dynamic visual indicator bars highlighting comparative organic and paid performance.
- **Area Visualizer**: High-aspect-ratio Recharts graph displaying user acquisition trends.

### 2. 📅 Multi-Step Google Calendar & Meet Scheduler
Located in the **Book Strategy Call** panel, this feature allows leads to schedule consultations seamlessly:
- **Details Phase**: Captures brand details, location, and user credentials.
- **Slots Selector**: Select dates and interactive times using a custom calendar.
- **Google Meet Conference**: Creates a calendar invite on Google Calendar and provisions a dynamic `meet.google.com` conference link using a Google Cloud Service Account.

### 3. 💬 Twilio WhatsApp Alerts
Triggers real-time alerts directly to the admin WhatsApp line when:
- A new contact form is submitted.
- A service booking inquiry enters the system.
- A strategy discovery call is scheduled.

### 4. ✉️ Resend & Nodemailer Email Pipelines
Dual-pipeline mail handler:
- **Client Side**: Dispatches a styled confirmation email notifying them their request is under analysis.
- **Admin Side**: Sends detailed client profile reports, budgets, and consultation times.
- **Fallback**: Nodemailer SMTP fallback handler when Resend keys are unconfigured.

### 5. 🎯 Custom GA4 & Clarity Tracking
Asynchronous tracking provider (`AnalyticsProvider`) that hooks directly into the TanStack Router resolution cycle:
- Automatically tracks page views on resolved routes.
- Dispatches event logs for WhatsApp clicks, email opens, call actions, service selections, case study collapses, and form completions.

---

## 🔧 Environment Variables

Create a `.env` file in the root directory to configure the server actions and calendar integrations:

```env
# --- Email Configurations (Resend or SMTP fallback) ---
RESEND_API_KEY=re_your_api_key

# Optional Nodemailer/SMTP backup credentials (if RESEND_API_KEY is omitted)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=hello@aurvyn.com
SMTP_PASS=your_smtp_password

# --- WhatsApp Notifications (Twilio) ---
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+916361063589

# --- Google Calendar Integration (Service Account API) ---
GOOGLE_CLIENT_EMAIL=aurvyn-calendar-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"

# --- Analytics Project Identifiers (Client-side Config) ---
VITE_GA_ID=G-XXXXXXXXXX
VITE_CLARITY_ID=qwert12345
```

> 💡 *Note: If any environment keys are missing during local development, the server actions will run in Mock/Simulation Mode, writing email/WhatsApp payloads to the server log and generating simulator Google Meet links to ensure an uninterrupted developer experience.*

---

## 💻 Local Development

### Prerequisites
Make sure you have Node.js (v18+) and npm/bun installed.

### 1. Install Dependencies
```bash
npm install
# or using Bun:
bun install
```

### 2. Run the Development Server
```bash
npm run dev
# or using Bun:
bun run dev
```
Open `http://localhost:5173` to see the site.

### 3. Build for Production
```bash
npm run build
```
This compiles the SSR build into `/dist` for client and server.

---

## 📂 Project Structure

```text
├── public/                 # Static files (images, favicons, branding assets)
│   ├── logo.png            # Main brand logo (wide format)
│   ├── favicon.png         # 1:1 Square tab icon
│   └── favicon.ico         # Legacy browser shortcut icon
├── src/
│   ├── components/         # React Components
│   │   ├── site/           # Shared page sections (Navbar, Footer, LiveDashboard)
│   │   └── ui/             # Core visual elements (Button, Calendar, Cards)
│   ├── config/             # Global configuration states
│   ├── lib/                # Backend API helper scripts (email, Google Meet, WhatsApp)
│   │   ├── actions.ts      # Server actions (submitContactForm, scheduleDiscoveryCall)
│   │   ├── email.ts        # Resend/SMTP mail sender
│   │   ├── google-calendar # Google Meet integration
│   │   └── whatsapp.ts     # Twilio WhatsApp notifier
│   └── routes/             # TanStack Start Route tree definitions
│       ├── __root.tsx      # Main layout shell, AnalyticsProvider wrapper
│       ├── index.tsx       # Home page (Hero, Dashboard, Trust strip)
│       └── work.tsx        # Dynamic Case Studies & Testimonials carousel
```
