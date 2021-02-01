const { google } = require("googleapis");
const calendar = google.calendar("v3");

const { getAuth } = require("./auth.googleapi.helper");

const insertEvent = (event, { auth, calendarId } = {}) => {
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
        resource: event,
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
};

module.exports = {
  insertEvent,
};
