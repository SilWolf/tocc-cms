"use strict";

const { formatGameToDescription } = require("../../game/helpers/game");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const createOrUpdateGCEvent = async (game) => {
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
          _slient: true,
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
        _slient: true,
      }
    );
  });
};

const createTrelloCard = async (game) => {
  const trelloBot = strapi.services.trelloBot;

  const payload = {
    name: `${game.code} - ${game.title}`,
    desc: formatGameToDescription(game),
    due: game.startAt,
    pos: "top",
    locationName: game.city.shopName,
    address: game.city.shopAddress,
  };

  const createdTrellloCard = await trelloBot.createCard(payload);

  const createdTrelloCheckList = await trelloBot.createCheckListByCardId(
    createdTrellloCard.id,
    {
      name: "待辦事項",
      pos: "top",
    }
  );

  for (const name of [
    "填寫劇本大綱",
    "給其他DM檢查",
    "發佈",
    "確認玩家的報名",
    "跑團",
    "派發獎勵及記錄",
  ]) {
    await trelloBot.createCheckItemByCheckListId(createdTrelloCheckList.id, {
      name: name,
      pos: "bottom",
    });
  }

  return createdTrellloCard;
};

const deleteTrelloCard = async (game) => {
  const trelloBot = strapi.services.trelloBot;
  if (game.trelloCardId) {
    trelloBot.deleteCardById(game.trelloCardId);
  }
};

module.exports = {
  lifecycles: {
    async afterCreate(game, data) {
      if (data._slient) {
        return;
      }

      if (game.status !== "draft") {
        createOrUpdateGCEvent(game);
      }

      if (!data.trelloCardId) {
        createTrelloCard(game).then((createdTrelloCard) => {
          strapi.services["game"].update(
            { id: game.id },
            {
              trelloCardId: createdTrelloCard.id,
              _slient: true,
            }
          );
        });
      }
    },

    async afterUpdate(game, _, data) {
      if (!data._slient) {
        if (game.status !== "draft") {
          createOrUpdateGCEvent(game);
        } else {
          deleteCalendarEvent(game.googleCalendarEventId);
        }
      }
    },

    async afterDelete(game) {
      if (game.googleCalendarEventId) {
        deleteCalendarEvent(game.googleCalendarEventId);
      }
      if (game.trelloCardId) {
        deleteTrelloCard(game);
      }
    },
  },
};
