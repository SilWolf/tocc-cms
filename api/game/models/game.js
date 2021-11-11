"use strict";

const { formatGameToDescription } = require("../../game/helpers/game");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const createOrUpdateCalendarEvent = async (game) => {
  const calendarBot = strapi.services.googleCalendarBot;

  const payload = {
    summary: game.title,
    location: `${game.city.name} (${game.city.shopName})`,
    description: formatGameToDescription(game),
    start: {
      dateTime: game.startAt,
      timeZone: "Asia/Hong_Kong",
    },
    end: {
      dateTime: game.endAt,
      timeZone: "Asia/Hong_Kong",
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 120 },
      ],
    },
  };

  if (game.googleCalendarEventId) {
    calendarBot.updateEvent(game.googleCalendarEventId, payload);
  } else {
    calendarBot.createEvent(payload).then((event) => {
      strapi.services["game"].update(
        { id: game.id },
        {
          googleCalendarEventId: event.data.id,
          googleCalendarEventUrl: event.data.htmlLink,
          _doNotUpdateGoogleCalendar: true,
        }
      );
    });
  }
};

const deleteCalendarEvent = async (googleCalendarEventId) => {
  calendarBot.deleteEvent(googleCalendarEventId).then(() => {
    strapi.services["game"].update(
      { id: game.id },
      {
        googleCalendarEventId: null,
        googleCalendarEventUrl: null,
        _doNotUpdateGoogleCalendar: true,
      }
    );
  });
};

module.exports = {
  lifecycles: {
    async afterCreate(event, data) {
      if (!data._doNotUpdateGoogleCalendar && event.status !== "draft") {
        createOrUpdateCalendarEvent(event);
      }
    },

    async afterUpdate(event, _, data) {
      if (!data._doNotUpdateGoogleCalendar) {
        if (event.status !== "draft") {
          createOrUpdateCalendarEvent(event);
        } else {
          deleteCalendarEvent(result.googleCalendarEventId);
        }
      }
    },

    async afterDelete(result) {
      if (result.googleCalendarEventId) {
        deleteCalendarEvent(result.googleCalendarEventId);
      }
    },
  },
};
