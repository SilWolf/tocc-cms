"use strict";

const {
  insertEvent,
  patchEvent,
  deleteEvent,
} = require("../../../helpers/googleapis/calendar.googleapi.helper");
const { formatGameToDescription } = require("../helpers/game");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // async beforeUpdate(params, data) {
    //   const entity = await strapi.services.game.findOne(params, []);

    //   // Case 1: update to draft and googleCalendarEventId exists
    //   if (data.status === "draft") {
    //     if (entity.googleCalendarEventId) {
    //       // delete the event
    //       try {
    //         await deleteEvent(entity.googleCalendarEventId);
    //         data.googleCalendarEventId = null;
    //         data.googleCalendarEventUrl = null;
    //       } catch (err) {
    //         console.error(err);
    //       }
    //     }
    //   } else {
    //     const event = {
    //       summary: data.title,
    //       location: `${data.city.name} (${data.city.shopName})`,
    //       description: formatGameToDescription(data),
    //       start: {
    //         dateTime: data.startAt,
    //         timeZone: "Asia/Hong_Kong",
    //       },
    //       end: {
    //         dateTime: data.endAt,
    //         timeZone: "Asia/Hong_Kong",
    //       },
    //       reminders: {
    //         useDefault: false,
    //         overrides: [
    //           { method: "email", minutes: 24 * 60 },
    //           { method: "popup", minutes: 60 },
    //         ],
    //       },
    //     };

    //     if (data.status === "published" && !entity.googleCalendarEventId) {
    //       // Case 2: update to published and the event Id does not exist
    //       try {
    //         const insertRes = await insertEvent(event);
    //         data.googleCalendarEventId = insertRes.data.id;
    //         data.googleCalendarEventUrl = insertRes.data.htmlLink;
    //       } catch (err) {
    //         console.error(err);
    //       }
    //       // Case 2b: update and event Id exists
    //     } else if (entity.googleCalendarEventId) {
    //       try {
    //         await patchEvent(entity.googleCalendarEventId, event);
    //       } catch (err) {
    //         console.error(err);
    //       }
    //     }
    //   }

    //   // Temporary fix on Strapi update bug
    //   data.characterAndRewards = data.characterAndRewards?.map((item) =>
    //     !item._id
    //       ? item
    //       : {
    //           ...item,
    //           _id: item._id?.toString() || undefined,
    //         }
    //   );
    //   data.journals = data.journals?.map((item) =>
    //     !item._id
    //       ? item
    //       : {
    //           ...item,
    //           _id: item._id?.toString() || undefined,
    //         }
    //   );
    //   // Temporary fix on Strapi update bug
    // },

    async afterDelete(result) {
      if (result?.googleCalendarEventId) {
        try {
          await deleteEvent(result.googleCalendarEventId);
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
};
