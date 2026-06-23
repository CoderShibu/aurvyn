// Retrieve configuration from env
const TWILIO_ACCOUNT_SID = (typeof process !== "undefined" && process.env?.TWILIO_ACCOUNT_SID) || "";
const TWILIO_AUTH_TOKEN = (typeof process !== "undefined" && process.env?.TWILIO_AUTH_TOKEN) || "";
const TWILIO_FROM = (typeof process !== "undefined" && process.env?.TWILIO_FROM_WHATSAPP_NUMBER) || "whatsapp:+14155238886"; // Default Twilio Sandbox number
const ADMIN_PHONE = (typeof process !== "undefined" && process.env?.ADMIN_WHATSAPP_NUMBER) || "whatsapp:+916361063589"; // Admin default WhatsApp

export type WhatsAppPayload = {
  name: string;
  brandName: string;
  phone: string;
  location: string;
  type: "Inquiry" | "Service Booking" | "Discovery Call";
  timestamp?: string;
};

/**
 * Sends a lead notification on WhatsApp using Twilio API.
 * Falls back to console printing in development if credentials are missing.
 */
export async function sendWhatsAppNotification(payload: WhatsAppPayload) {
  const timeStr = payload.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  
  // Format message as requested
  const messageBody = [
    `NEW AURVYN LEAD`,
    ``,
    `Name:`,
    payload.name,
    ``,
    `Brand:`,
    payload.brandName,
    ``,
    `Contact:`,
    payload.phone,
    ``,
    `Location:`,
    payload.location,
    ``,
    `Type:`,
    payload.type,
    ``,
    `Time:`,
    timeStr,
  ].join("\n");

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    try {
      // Direct REST API fetch request to avoid Twilio SDK issues or load latency.
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
      
      const formData = new URLSearchParams();
      formData.append("From", TWILIO_FROM.startsWith("whatsapp:") ? TWILIO_FROM : `whatsapp:${TWILIO_FROM}`);
      formData.append("To", ADMIN_PHONE.startsWith("whatsapp:") ? ADMIN_PHONE : `whatsapp:${ADMIN_PHONE}`);
      formData.append("Body", messageBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      console.log(`[WhatsApp Success] Twilio alert sent: ${data.sid}`);
      return { success: true, sid: data.sid };
    } catch (error) {
      console.error("[Twilio WhatsApp Error]", error);
    }
  }

  // Developer Fallback Logger
  console.warn(
    `\n=== [DEV WHATSAPP SIMULATOR] ===\n` +
    `To:      ${ADMIN_PHONE}\n` +
    `Message:\n` +
    `-----------------------------\n` +
    `${messageBody}\n` +
    `=============================\n`
  );
  
  return { success: true, mocked: true };
}
