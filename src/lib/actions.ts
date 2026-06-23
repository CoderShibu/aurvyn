import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { 
  sendEmail, 
  getClientConfirmationTemplate, 
  getAdminContactNotificationTemplate, 
  getAdminServiceNotificationTemplate,
  getDiscoveryCallDetailsTemplate
} from "./email";
import { sendWhatsAppNotification } from "./whatsapp";
import { createGoogleMeetEvent } from "./google-calendar";

// 1. Contact Form Action
const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  company: z.string().trim().min(1),
  message: z.string().trim().min(10),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[Server Action] submitContactForm starting", data);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 1. Send detailed email to Admin
    const adminEmailHtml = getAdminContactNotificationTemplate(data);
    await sendEmail({
      to: "shibasish2005@gmail.com",
      subject: `New AURVYN Lead | Contact: ${data.company}`,
      html: adminEmailHtml,
    });

    // 2. Send confirmation email to Client
    const clientEmailHtml = getClientConfirmationTemplate(data.name);
    await sendEmail({
      to: data.email,
      subject: "Your Request Has Been Received | AURVYN",
      html: clientEmailHtml,
    });

    // 3. Send WhatsApp Notification to Admin
    await sendWhatsAppNotification({
      name: data.name,
      brandName: data.company,
      phone: data.phone,
      location: "N/A (Contact Form)",
      type: "Inquiry",
      timestamp,
    });

    return { success: true };
  });

// 2. Service Booking Action
const serviceBookingSchema = z.object({
  name: z.string().trim().min(2),
  brandName: z.string().trim().min(1),
  phone: z.string().trim().min(7),
  email: z.string().trim().email(),
  location: z.string().trim().min(1),
  serviceSelected: z.string().min(1),
  budget: z.string().min(1),
  description: z.string().trim().min(10),
});

export const submitServiceBooking = createServerFn({ method: "POST" })
  .validator((data: unknown) => serviceBookingSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[Server Action] submitServiceBooking starting", data);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 1. Send detailed email to Admin
    const adminEmailHtml = getAdminServiceNotificationTemplate(data);
    await sendEmail({
      to: "shibasish2005@gmail.com",
      subject: "New AURVYN Service Inquiry",
      html: adminEmailHtml,
    });

    // 2. Send confirmation email to Client
    const clientEmailHtml = getClientConfirmationTemplate(data.name);
    await sendEmail({
      to: data.email,
      subject: "Your Request Has Been Received | AURVYN",
      html: clientEmailHtml,
    });

    // 3. Send WhatsApp Notification to Admin
    await sendWhatsAppNotification({
      name: data.name,
      brandName: data.brandName,
      phone: data.phone,
      location: data.location,
      type: "Service Booking",
      timestamp,
    });

    return { success: true };
  });

// 3. Discovery Strategy Call Action
const discoveryCallSchema = z.object({
  name: z.string().trim().min(2),
  brandName: z.string().trim().min(1),
  phone: z.string().trim().min(7),
  email: z.string().trim().email(),
  location: z.string().trim().min(1),
  dateStr: z.string().min(1), // format: YYYY-MM-DD
  timeSlot: z.string().min(1), // format: HH:MM AM/PM
});

export const scheduleDiscoveryCall = createServerFn({ method: "POST" })
  .validator((data: unknown) => discoveryCallSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[Server Action] scheduleDiscoveryCall starting", data);
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Parse meeting times in Indian Standard Time (IST, UTC+05:30)
    // Example: dateStr = "2026-06-25", timeSlot = "10:00 AM"
    let hours = 10;
    let minutes = 0;
    try {
      const parts = data.timeSlot.split(" ");
      const timeParts = parts[0].split(":");
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
      const ampm = parts[1];
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    } catch (e) {
      console.error("Failed to parse timeSlot, falling back to 10:00 AM", e);
    }

    const pad = (val: number) => String(val).padStart(2, "0");
    const startTime = `${data.dateStr}T${pad(hours)}:${pad(minutes)}:00+05:30`;

    // Strategy calls last 30 minutes
    let endHours = hours;
    let endMinutes = minutes + 30;
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }
    const endTime = `${data.dateStr}T${pad(endHours)}:${pad(endMinutes)}:00+05:30`;

    // 1. Generate Google Meet Calendar Event
    const calendarRes = await createGoogleMeetEvent({
      summary: `AURVYN Growth Strategy Call: ${data.brandName}`,
      description: `Growth Strategy consultation call with AURVYN.\nClient: ${data.name}\nBrand: ${data.brandName}\nLocation: ${data.location}\nPhone: ${data.phone}`,
      startTime,
      endTime,
      clientEmail: data.email,
      clientName: data.name,
    });

    const meetLink = calendarRes.meetLink;
    const formattedDate = new Date(data.dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // 2. Send meeting details to Admin
    const adminEmailHtml = getDiscoveryCallDetailsTemplate({
      ...data,
      dateStr: formattedDate,
      meetLink,
      isAdmin: true,
    });
    await sendEmail({
      to: "shibasish2005@gmail.com",
      subject: `Discovery Call scheduled: ${data.brandName}`,
      html: adminEmailHtml,
    });

    // 3. Send meeting invite / confirmation email to client
    const clientEmailHtml = getDiscoveryCallDetailsTemplate({
      ...data,
      dateStr: formattedDate,
      meetLink,
      isAdmin: false,
    });
    await sendEmail({
      to: data.email,
      subject: `Your Discovery Call is Scheduled | AURVYN`,
      html: clientEmailHtml,
    });

    // 4. Dispatch WhatsApp lead alert
    await sendWhatsAppNotification({
      name: data.name,
      brandName: data.brandName,
      phone: data.phone,
      location: data.location,
      type: "Discovery Call",
      timestamp,
    });

    return { 
      success: true, 
      meetLink,
      dateStr: formattedDate,
      timeSlot: data.timeSlot
    };
  });
