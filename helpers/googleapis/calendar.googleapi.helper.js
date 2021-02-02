const { google } = require("googleapis");
const calendar = google.calendar("v3");

const { getAuth } = require("./auth.googleapi.helper");

module.exports = {
  insertEvent(event, { auth, calendarId } = {}) {
    return new Promise((resolve, reject) => {
      calendar.events.insert(
        {
          auth:
            auth ||
            getAuth({
              scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events",
              ],
            }),
          calendarId: calendarId || process.env.GOOGLE_API_CALENDER_ID,
          sendUpdates: "all",
          requestBody: event,
        },
        (err, event) => {
          if (err) {
            console.log("[calendar.googleapi.helper] InsertEventError: " + err);
            reject(err);
          }
          resolve(event);
        }
      );
    });
  },

  patchEvent(eventId, event, { auth, calendarId } = {}) {
    return new Promise((resolve, reject) => {
      calendar.events.patch(
        {
          auth:
            auth ||
            getAuth({
              scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events",
              ],
            }),
          eventId,
          calendarId: calendarId || process.env.GOOGLE_API_CALENDER_ID,
          sendUpdates: "all",
          requestBody: event,
        },
        (err, event) => {
          if (err) {
            console.log("[calendar.googleapi.helper] patchEventError: " + err);
            reject(err);
          }
          resolve(event);
        }
      );
    });
  },

  deleteEvent(eventId, { auth, calendarId } = {}) {
    return new Promise((resolve, reject) => {
      calendar.events.delete(
        {
          auth:
            auth ||
            getAuth({
              scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events",
              ],
            }),
          eventId,
          calendarId: calendarId || process.env.GOOGLE_API_CALENDER_ID,
          sendUpdates: "all",
        },
        (err, event) => {
          if (err) {
            console.log("[calendar.googleapi.helper] DeleteEventError: " + err);
            reject(err);
          }
          resolve(event);
        }
      );
    });
  },
};
