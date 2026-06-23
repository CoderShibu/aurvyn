import { Resend } from "resend";
import nodemailer from "nodemailer";

// Retrieve configuration from env
const RESEND_API_KEY = (typeof process !== "undefined" && process.env?.RESEND_API_KEY) || "";
const SMTP_HOST = (typeof process !== "undefined" && process.env?.SMTP_HOST) || "";
const SMTP_PORT = Number(typeof process !== "undefined" && process.env?.SMTP_PORT) || 587;
const SMTP_USER = (typeof process !== "undefined" && process.env?.SMTP_USER) || "";
const SMTP_PASS = (typeof process !== "undefined" && process.env?.SMTP_PASS) || "";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Dispatches an email using Resend or SMTP Nodemailer.
 * Falls back to console logging in development if credentials are missing.
 */
export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  // Use a fallback Sender address
  const fromName = "AURVYN";
  const fromEmail = RESEND_API_KEY ? "onboarding@resend.dev" : (SMTP_USER || "hello@aurvyn.com");
  const fromField = `${fromName} <${fromEmail}>`;

  if (RESEND_API_KEY) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      const data = await resend.emails.send({
        from: fromField,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""),
      });
      if (data.error) {
        throw new Error(JSON.stringify(data.error));
      }
      console.log(`[Resend Success] Email sent to ${to}: ${data.data?.id}`);
      return { success: true, id: data.data?.id };
    } catch (error) {
      console.error("[Resend Error, trying Nodemailer SMTP fallback if configured]", error);
    }
  }

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: fromField,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""),
      });

      console.log(`[Nodemailer Success] Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("[Nodemailer SMTP Error]", error);
    }
  }

  // Developer Fallback Logger
  const rawText = text || html.replace(/<[^>]*>/g, "\n").replace(/\n+/g, "\n");
  console.warn(
    `\n=== [DEV EMAIL SIMULATOR] ===\n` +
    `To:      ${to}\n` +
    `Subject: ${subject}\n` +
    `-----------------------------\n` +
    `${rawText}\n` +
    `=============================\n`
  );

  return { success: true, mocked: true };
}

// Brand theme constants
const BRAND_BG = "#050505";
const BRAND_ACCENT = "#F24455";
const BRAND_CARD = "#121212";
const BRAND_TEXT = "#E5E5E5";
const BRAND_MUTED = "#A3A3A3";

/**
 * Generates email template wrapper
 */
function getEmailWrapper(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            background-color: ${BRAND_BG};
            color: ${BRAND_TEXT};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: ${BRAND_CARD};
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .logo {
            font-family: "Inter", sans-serif;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.18em;
            color: #FFFFFF;
            margin-bottom: 24px;
            text-align: center;
          }
          .divider {
            height: 1px;
            background-color: rgba(255, 255, 255, 0.08);
            margin: 24px 0;
          }
          .footer {
            margin-top: 32px;
            font-size: 11px;
            color: ${BRAND_MUTED};
            text-align: center;
            line-height: 1.6;
          }
          a {
            color: ${BRAND_ACCENT};
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">AURVYN</div>
          <div class="divider"></div>
          ${contentHtml}
          <div class="divider"></div>
          <div class="footer">
            © ${new Date().getFullYear()} AURVYN. All rights reserved.<br>
            Attention, authority, and revenue — engineered as systems.<br>
            Contact: <a href="tel:6361063589">+91 6361063589</a> | Email: <a href="mailto:aurvynn@gmail.com">aurvynn@gmail.com</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Confirmation template sent to clients
 */
export function getClientConfirmationTemplate(name: string) {
  const htmlContent = `
    <h2 style="font-size: 22px; font-weight: 500; color: #FFFFFF; margin-top: 0; text-align: center;">Your Request Has Been Received</h2>
    <p style="font-size: 14px; line-height: 1.6; color: ${BRAND_TEXT};">Hello ${name},</p>
    <p style="font-size: 14px; line-height: 1.6; color: ${BRAND_TEXT};">Thank you for reaching out to AURVYN. We have received your inquiry, and our growth team is already analyzing your details.</p>
    
    <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="font-size: 14px; font-weight: 600; color: #FFFFFF; margin-top: 0; text-transform: uppercase; letter-spacing: 0.1em; color: ${BRAND_ACCENT};">Next Steps</h3>
      <ol style="font-size: 13px; line-height: 1.7; color: ${BRAND_TEXT}; margin-bottom: 0; padding-left: 20px;">
        <li><strong>Review</strong>: We assess your website, brand positioning, and market space.</li>
        <li><strong>Reach Out</strong>: A growth director will contact you via email or phone.</li>
        <li><strong>Strategy Blueprint</strong>: We map out a high-leverage growth roadmap on a 30-min strategy call.</li>
      </ol>
    </div>
    
    <p style="font-size: 13px; line-height: 1.6; color: ${BRAND_MUTED};"><strong>Expected Response Time</strong>: We respond within 1 business day (Monday – Friday, 10:00 – 19:00 IST).</p>
    <p style="font-size: 14px; line-height: 1.6; color: ${BRAND_TEXT};">Talk soon,<br><span style="color: #FFFFFF; font-weight: 500;">The AURVYN Growth Team</span></p>
  `;
  return getEmailWrapper(htmlContent);
}

/**
 * Admin Notification: Contact Lead
 */
export function getAdminContactNotificationTemplate(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}) {
  const htmlContent = `
    <h2 style="font-size: 20px; color: ${BRAND_ACCENT}; margin-top: 0;">New Contact Form Lead</h2>
    <p style="font-size: 14px; color: ${BRAND_TEXT};">A new contact inquiry has been submitted on the AURVYN website.</p>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED}; width: 130px; font-weight: 500;">Full Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.name}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED}; font-weight: 500;">Brand Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.company}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Email:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Contact Number:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Timestamp:</td>
        <td style="padding: 10px 0; color: #FFFFFF;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    
    <div style="background-color: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.06);">
      <div style="font-size: 11px; text-transform: uppercase; tracking: 0.1em; color: ${BRAND_MUTED}; margin-bottom: 8px;">Message</div>
      <div style="font-size: 13px; line-height: 1.6; color: ${BRAND_TEXT}; white-space: pre-wrap;">${data.message}</div>
    </div>
  `;
  return getEmailWrapper(htmlContent);
}

/**
 * Admin Notification: Service Booking Lead
 */
export function getAdminServiceNotificationTemplate(data: {
  name: string;
  brandName: string;
  phone: string;
  email: string;
  location: string;
  serviceSelected: string;
  budget: string;
  description: string;
}) {
  const htmlContent = `
    <h2 style="font-size: 20px; color: ${BRAND_ACCENT}; margin-top: 0;">New AURVYN Service Inquiry</h2>
    <p style="font-size: 14px; color: ${BRAND_TEXT};">A service booking inquiry has been submitted.</p>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED}; width: 130px; font-weight: 500;">Full Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.name}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED}; font-weight: 500;">Brand Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.brandName}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Selected Service:</td>
        <td style="padding: 10px 0; color: ${BRAND_ACCENT}; font-weight: 600;">${data.serviceSelected}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Budget Range:</td>
        <td style="padding: 10px 0; color: #FFFFFF;">${data.budget}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Location:</td>
        <td style="padding: 10px 0; color: #FFFFFF;">${data.location}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Email:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Contact:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Timestamp:</td>
        <td style="padding: 10px 0; color: #FFFFFF;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    
    <div style="background-color: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.06);">
      <div style="font-size: 11px; text-transform: uppercase; tracking: 0.1em; color: ${BRAND_MUTED}; margin-bottom: 8px;">Project Description</div>
      <div style="font-size: 13px; line-height: 1.6; color: ${BRAND_TEXT}; white-space: pre-wrap;">${data.description}</div>
    </div>
  `;
  return getEmailWrapper(htmlContent);
}

/**
 * Admin & Client: Discovery Strategy Call scheduled details
 */
export function getDiscoveryCallDetailsTemplate(data: {
  name: string;
  brandName: string;
  phone: string;
  email: string;
  location: string;
  dateStr: string;
  timeSlot: string;
  meetLink: string;
  isAdmin: boolean;
}) {
  const recipientGreeting = data.isAdmin 
    ? `<h2 style="font-size: 20px; color: ${BRAND_ACCENT}; margin-top: 0;">New Discovery Call Booked</h2>` 
    : `<h2 style="font-size: 20px; color: #FFFFFF; margin-top: 0; text-align: center;">Discovery Call Scheduled successfully</h2>`;

  const bodyPara = data.isAdmin
    ? `<p style="font-size: 14px; color: ${BRAND_TEXT};">A client has scheduled a strategy call. A Google Calendar meeting with Google Meet has been generated.</p>`
    : `<p style="font-size: 14px; color: ${BRAND_TEXT}; text-align: center;">Hi ${data.name}, your strategy call with AURVYN has been scheduled. Google Meet links and calendar invites have been dispatched.</p>`;

  const htmlContent = `
    ${recipientGreeting}
    ${bodyPara}
    
    <div style="background-color: rgba(242, 68, 85, 0.06); border: 1px solid rgba(242, 68, 85, 0.15); border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: ${BRAND_MUTED};">Meeting Time (IST)</div>
      <div style="font-size: 20px; font-weight: 600; color: #FFFFFF; margin: 8px 0;">${data.dateStr} @ ${data.timeSlot}</div>
      <div style="margin-top: 14px;">
        <a href="${data.meetLink}" target="_blank" style="display: inline-block; background-color: ${BRAND_ACCENT}; color: #FFFFFF; font-size: 13px; font-weight: 500; text-transform: uppercase; padding: 10px 24px; border-radius: 99px; letter-spacing: 0.08em; box-shadow: 0 4px 12px rgba(242, 68, 85, 0.3);">
          Join Google Meet
        </a>
      </div>
      <div style="font-size: 11px; color: ${BRAND_MUTED}; margin-top: 10px;">
        Link: <a href="${data.meetLink}" target="_blank" style="color: ${BRAND_MUTED}; text-decoration: underline;">${data.meetLink}</a>
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED}; width: 130px;">Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.name}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Brand Name:</td>
        <td style="padding: 10px 0; color: #FFFFFF; font-weight: 500;">${data.brandName}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Location:</td>
        <td style="padding: 10px 0; color: #FFFFFF;">${data.location}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Email:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <td style="padding: 10px 0; color: ${BRAND_MUTED};">Contact Phone:</td>
        <td style="padding: 10px 0; color: #FFFFFF;"><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
    </table>
  `;
  return getEmailWrapper(htmlContent);
}
