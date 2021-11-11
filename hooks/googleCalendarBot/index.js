const { google } = require("googleapis");
const calendar = google.calendar("v3");

module.exports = (strapi) => {
  return {
    async initialize() {
      const { privateKey, clientEmail, calendarId } = strapi.config.get(
        "hook.settings.googleCalendarBot"
      );

      const _getAuth = ({ scopes }) =>
        new google.auth.GoogleAuth({
          credentials: {
            private_key: privateKey.replace(/\\n/gm, "\n"),
            client_email: clientEmail,
          },
          scopes: scopes || [],
        });

      const bot = {
        createEvent: async (event) => {
          return new Promise((resolve, reject) =>
            calendar.events.insert(
              {
                auth: _getAuth({
                  scopes: [
                    "https://www.googleapis.com/auth/calendar",
                    "https://www.googleapis.com/auth/calendar.events",
                  ],
                }),
                calendarId: calendarId,
                sendUpdates: "all",
                requestBody: event,
              },
              (err, event) => {
                if (err) {
                  console.log("[GoogleCalendarBot] InsertEventError: " + err);
                  reject(err);
                }
                resolve(event);
              }
            )
          );
        },

        updateEvent: async (eventId, event = {}) => {
          return new Promise((resolve, reject) => {
            calendar.events.patch(
              {
                auth: _getAuth({
                  scopes: [
                    "https://www.googleapis.com/auth/calendar",
                    "https://www.googleapis.com/auth/calendar.events",
                  ],
                }),
                eventId,
                calendarId: calendarId,
                sendUpdates: "all",
                requestBody: event,
              },
              (err, event) => {
                if (err) {
                  console.log("[GoogleCalendarBot] patchEventError: " + err);
                  reject(err);
                }
                resolve(event);
              }
            );
          });
        },

        deleteEvent(eventId) {
          return new Promise((resolve, reject) => {
            calendar.events.delete(
              {
                auth: _getAuth({
                  scopes: [
                    "https://www.googleapis.com/auth/calendar",
                    "https://www.googleapis.com/auth/calendar.events",
                  ],
                }),
                eventId,
                calendarId: calendarId,
                sendUpdates: "all",
              },
              (err, event) => {
                if (err) {
                  console.log("[GoogleCalendarBot] DeleteEventError: " + err);
                  reject(err);
                }
                resolve(event);
              }
            );
          });
        },
      };

      strapi.services.googleCalendarBot = bot;
      strapi.services.googleCalendarBotCache = {};
    },
  };
};
