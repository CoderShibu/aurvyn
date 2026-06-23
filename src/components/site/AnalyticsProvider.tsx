import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { ANALYTICS_CONFIG } from "@/config/analytics";

// TypeScript declarations for global tracker objects
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

/**
 * Standard GA4 tracking helper
 */
export function trackGAEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else {
    console.log(`[GA Event Mock] ${eventName}`, params);
  }
}

/**
 * Standard Clarity event helper
 */
export function trackClarityEvent(eventName: string) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", eventName);
  } else {
    console.log(`[Clarity Event Mock] ${eventName}`);
  }
}

// 1. trackPageView()
export function trackPageView(url: string) {
  trackGAEvent("page_view", { page_path: url, page_location: typeof window !== "undefined" ? window.location.href : "" });
}

// 2. trackButtonClick()
export function trackButtonClick(buttonName: string, metadata: Record<string, any> = {}) {
  trackGAEvent("button_click", { button_name: buttonName, ...metadata });
  trackClarityEvent(`click_${buttonName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`);
}

// 3. trackServiceInquiry()
export function trackServiceInquiry(service: string, budget: string) {
  trackGAEvent("SERVICE_SELECTED", { service, budget });
  trackGAEvent("generate_lead", { value: 1.0, currency: "INR", transaction_id: `sb-${Date.now()}` });
  trackClarityEvent("service_selected");
}

// 4. trackContactSubmission()
export function trackContactSubmission(name: string) {
  trackGAEvent("CONTACT_FORM_SUBMITTED", { client_name: name });
  trackGAEvent("generate_lead", { value: 0.5, currency: "INR", transaction_id: `cf-${Date.now()}` });
  trackClarityEvent("contact_form_submitted");
}

// 5. trackDiscoveryCall()
export function trackDiscoveryCall(dateTime: string) {
  trackGAEvent("DISCOVERY_CALL_SCHEDULED", { date_time: dateTime });
  trackGAEvent("generate_lead", { value: 2.0, currency: "INR", transaction_id: `dc-${Date.now()}` });
  trackClarityEvent("discovery_call_scheduled");
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Load scripts on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load GA4
    const gaId = ANALYTICS_CONFIG.googleAnalyticsId?.trim();
    if (gaId) {
      // Avoid duplicate script loads
      if (!document.getElementById("google-tag-manager")) {
        const gaScript = document.createElement("script");
        gaScript.id = "google-tag-manager";
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", gaId, {
          send_page_view: false, // Page views handled manually via routing
        });
      }
    }

    // Load Microsoft Clarity
    const clarityId = ANALYTICS_CONFIG.microsoftClarityId?.trim();
    if (clarityId) {
      if (!document.getElementById("microsoft-clarity-script")) {
        const clarityScript = document.createElement("script");
        clarityScript.id = "microsoft-clarity-script";
        clarityScript.async = true;
        clarityScript.innerHTML = `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `;
        document.head.appendChild(clarityScript);
      }
    }
  }, []);

  // Track route changes
  useEffect(() => {
    const unsubscribe = router.subscribe("onResolved", () => {
      const pathname = router.state.location.pathname;
      trackPageView(pathname);
    });

    // Fire initial page view
    trackPageView(window.location.pathname);

    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
}
