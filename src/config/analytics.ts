/**
 * AURVYN Analytics & User Behavior Tracking Configuration
 * 
 * You can configure your tracking IDs here or via environment variables:
 * - Google Analytics 4 ID: NEXT_PUBLIC_GA_ID or VITE_GA_ID
 * - Microsoft Clarity ID: NEXT_PUBLIC_CLARITY_ID or VITE_CLARITY_ID
 */
export const ANALYTICS_CONFIG = {
  // 1. Google Analytics 4 Measurement ID (e.g. 'G-XXXXXXXXXX')
  googleAnalyticsId: 
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GA_ID) || 
    (typeof process !== "undefined" && process.env?.VITE_GA_ID) || 
    (import.meta.env?.NEXT_PUBLIC_GA_ID as string) ||
    (import.meta.env?.VITE_GA_ID as string) ||
    "", // Paste here directly: e.g. "G-XXXXXXXXXX"

  // 2. Microsoft Clarity Project ID (e.g. 'qwert12345')
  microsoftClarityId: 
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CLARITY_ID) || 
    (typeof process !== "undefined" && process.env?.VITE_CLARITY_ID) || 
    (import.meta.env?.NEXT_PUBLIC_CLARITY_ID as string) ||
    (import.meta.env?.VITE_CLARITY_ID as string) ||
    "", // Paste here directly: e.g. "qwert12345"
};
