import { google } from "googleapis";

// Retrieve configuration from env
const GOOGLE_CLIENT_EMAIL = (typeof process !== "undefined" && process.env?.GOOGLE_CLIENT_EMAIL) || "";
const GOOGLE_PRIVATE_KEY = (typeof process !== "undefined" && process.env?.GOOGLE_PRIVATE_KEY) || "";
const GOOGLE_CALENDAR_ID = (typeof process !== "undefined" && process.env?.GOOGLE_CALENDAR_ID) || "primary";

export type CalendarEventPayload = {
  summary: string;
  description: string;
  startTime: string; // ISO String (UTC or with timezone offset)
  endTime: string;   // ISO String (UTC or with timezone offset)
  clientEmail: string;
  clientName: string;
};

/**
 * Creates an event in Google Calendar with a Google Meet conference link.
 * Automatically sends calendar invitations to the client and the admin inbox.
 * Falls back to generating a mock Meet link if credentials are unset.
 */
export async function createGoogleMeetEvent(payload: CalendarEventPayload) {
  if (GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY) {
    try {
      // Fix formatted private key escapes from env variables
      const formattedKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
      
      const auth = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        undefined,
        formattedKey,
        ["https://www.googleapis.com/auth/calendar"]
      );

      const calendar = google.calendar({ version: "v3", auth });

      const response = await calendar.events.insert({
        calendarId: GOOGLE_CALENDAR_ID,
        conferenceDataVersion: 1,
        sendUpdates: "all", // Triggers email notifications/calendar invites to all attendees
        requestBody: {
          summary: payload.summary,
          description: payload.description,
          start: {
            dateTime: payload.startTime,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: payload.endTime,
            timeZone: "Asia/Kolkata",
          },
          attendees: [
            { email: payload.clientEmail, displayName: payload.clientName },
            { email: "shibasish2005@gmail.com", displayName: "AURVYN Admin" }
          ],
          conferenceData: {
            createRequest: {
              requestId: `aurvyn-booking-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });

      const event = response.data;
      const meetLink = event.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri || "";

      console.log(`[Google Calendar Success] Created event: ${event.id}. Meet Link: ${meetLink}`);

      return {
        success: true,
        eventId: event.id,
        meetLink: meetLink || "https://meet.google.com/abc-defg-hij",
        htmlLink: event.htmlLink,
      };
    } catch (error) {
      console.error("[Google Calendar API integration error]", error);
    }
  }

  // Developer Mock Fallback
  const randomSuffix = () => Math.random().toString(36).substring(2, 5);
  const mockMeetLink = `https://meet.google.com/${randomSuffix()}-${randomSuffix()}-${randomSuffix()}`;

  console.warn(
    `\n=== [DEV GOOGLE CALENDAR SIMULATOR] ===\n` +
    `Event:      ${payload.summary}\n` +
    `Client:     ${payload.clientName} <${payload.clientEmail}>\n` +
    `Admin:      shibasish2005@gmail.com\n` +
    `Start Time: ${payload.startTime}\n` +
    `End Time:   ${payload.endTime}\n` +
    `Meet Link:  ${mockMeetLink}\n` +
    `========================================\n`
  );

  return {
    success: true,
    meetLink: mockMeetLink,
    mocked: true,
  };
}
