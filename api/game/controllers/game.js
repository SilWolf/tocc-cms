"use strict";

const { sanitizeEntity } = require("strapi-utils");
const { formatGameToDescription } = require("../helpers/game");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { _pending, ...query } = ctx.query;
    if (ctx.state?.user?.role?.name !== "Dungeon Master") {
      query["status_ne"] = "draft";
    }

    let entities;
    if (_pending) {
      entities = await strapi.services.game.find({
        status: "published",
      });
    } else if (query._q) {
      entities = await strapi.services.game.search(query);
    } else {
      entities = await strapi.services.game.find(query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.game })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.game.findOne({ id });
    if (
      entity.status === "draft" &&
      ctx.state?.user?.role?.name !== "Dungeon Master"
    ) {
      return ctx.notFound();
    }
    return sanitizeEntity(entity, { model: strapi.models.game });
  },

  count(ctx) {
    const query = ctx.query;
    if (ctx.state?.user?.role?.name !== "Dungeon Master") {
      query["status_ne"] = "draft";
    }

    if (query._q) {
      return strapi.services.game.countSearch(ctx.query);
    }
    return strapi.services.game.count(ctx.query);
  },

  async patchToDraft(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.game.findOne({ id });
    if (entity.status !== "published") {
      return ctx.badRequest();
    }

    const updatedEntity = await strapi.services.game.update(
      { id },
      {
        ...entity,
        status: "draft",
        publishedAt: null,
      }
    );

    return sanitizeEntity(updatedEntity, { model: strapi.models.game });
  },

  async patchToPublished(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.game.findOne({ id });
    if (entity.status !== "draft") {
      return ctx.badRequest();
    }

    const updatedEntity = await strapi.services.game.update(
      { id },
      {
        status: "published",
        publishedAt: new Date().toISOString(),
      }
    );

    const output = sanitizeEntity(updatedEntity, { model: strapi.models.game });

    return output;
  },

  async patchToConfirmed(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.game.findOne({ id });
    if (entity.status !== "published") {
      return ctx.badRequest();
    }

    const { gameSignUps } = await ctx.request.body;

    for (const gameSignUp of gameSignUps) {
      const updatedGameSignUp = await strapi.services["game-sign-up"].update(
        { id: gameSignUp.id },
        {
          status: gameSignUp.status,
        }
      );

      if (updatedGameSignUp.status === "accepted") {
        await strapi.services["character-record"].create({
          game: id,
          player: updatedGameSignUp.player.id,
          character: updatedGameSignUp.character.id,
          gameSignUp: updatedGameSignUp.id,
        });
      }
    }

    const updatedEntity = await strapi.services.game.update(
      { id },
      {
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
      }
    );

    const output = sanitizeEntity(updatedEntity, { model: strapi.models.game });

    return output;
  },

  async patchToCompleted(ctx) {
    const { id } = ctx.params;

    const game = await strapi
      .query("game")
      .model.findOne({ _id: ObjectId(id) });

    console.log(game);

    if (!game) {
      return ctx.notFound();
    }
    if (game.status !== "confirmed") {
      return ctx.badRequest();
    }

    const gameSignUps = await strapi
      .query("game-sign-up")
      .model.find({ game: Object(game._id), status: "accepted" });

    const characterRecordMap = gameSignUps.reduce((prev, gameSignUp) => {
      prev[gameSignUp.character] = {
        subject: `[${game.code}] ${game.title}獎勵`,
        content: "",
        worldStartAt: game.worldStartAt,
        worldEndAt: game.worldEndAt,
        player: gameSignUp.player,
        character: gameSignUp.character,
        game: game._id,
        reward: {},
      };

      return prev;
    }, {});

    const applyRewardToCharacter = (
      characterId,
      amount,
      unit,
      description,
      metadata
    ) => {
      if (!characterRecordMap[characterId]) {
        return;
      }

      if (!characterRecordMap[characterId].reward[unit]) {
        characterRecordMap[characterId].reward[unit] = {
          amount: 0,
          details: [],
        };
      }

      characterRecordMap[characterId].reward[unit].amount += amount;
      characterRecordMap[characterId].reward[unit].details.push({
        description,
        amount,
        metadata,
      });
    };

    const outline = game.outline;
    const outlineRewardCharacterMap = game.outlineRewardCharacterMap;

    for (const outlineItem of outline) {
      for (const rewardConfig of outlineItem.rewards) {
        const reward = {
          ...rewardConfig,
          ...(outlineRewardCharacterMap[rewardConfig.id] || {}),
        };

        if (!reward.characterMap) {
          continue;
        }
        if (reward.denominator === 0) {
          continue;
        }

        for (const characterId in reward.characterMap) {
          applyRewardToCharacter(
            characterId,
            (reward.amount / reward.denominator) *
              reward.characterMap[characterId].ratio,
            reward.unit,
            outlineItem.description,
            {
              outlineItemId: outlineItem.id,
              rewardId: reward.id,
            }
          );
        }
      }
    }

    for (const characterRecord of Object.values(characterRecordMap)) {
      await strapi.services["character-record"].create(characterRecord);
    }

    await strapi.services["game"].update({ id: game._id }, { status: "done" });

    return {};
  },

  async broadcast(ctx) {
    const { id } = ctx.params;

    const game = await strapi.services.game.findOne({ id });
    if (game.status === "draft") {
      return ctx.notFound();
    }

    const players = await strapi
      .query("user", "users-permissions")
      .model.find({ telegramChatId: { $exists: 1 } }, "_id telegramChatId")
      .exec();

    // const message = [
    //   `#${game.code}`,
    //   `<b>${game.code} - ${game.title}</b>`,
    //   `時間: ${}`,
    //   `地點: ${game.city.shopName}`,
    //   `費用: (待補)`,
    //   `等級: Lv ${game.lvMin}-${game.lvMax}`,
    //   `DM: ${game.dm.name}`,
    //   `[任務開始日期：第三紀元${worldDate.getFullYear()}年${worldDate.getMonth() + 1}月${worldDate.getDate()}]`,
    //   '',
    //   game.description
    // ].join("\n");

    const message = formatGameToDescription(game);

    const bot = strapi.services.telegramBot;
    players.forEach((player) => {
      bot.sendMessage(
        player.telegramChatId,
        ["嗨！又有一場新的冒險等待著你！", "", message].join("\n"),
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "馬上報名",
                  callback_data: `signUpForGame:${game.id}`,
                },
              ],
            ],
          },
        }
      );
    });

    if (game.city && game.city.telegramChatId) {
      bot.sendMessage(
        game.city.telegramChatId,
        ["嗨！又有一場新的冒險等待著你們！", "", message].join("\n"),
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "馬上報名",
                  url: "https://forms.gle/obScEGkKtSW54Dee7",
                },
              ],
            ],
          },
        }
      );
    }

    return sanitizeEntity(game, { model: strapi.models.game });
  },

  async postSignUp(ctx) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized({ errorCode: "NOT_AUTHORIZED" });
    }

    const { id } = ctx.params;
    const signUp = await strapi.services["game-sign-up"].findOne({
      player: user.id,
      game: id,
    });

    if (signUp) {
      return ctx.badRequest({
        errorCode: "ALREADY_SIGN_UP",
        data: sanitizeEntity(signUp, {
          model: strapi.models["game-sign-up"],
        }),
      });
    }

    const game = await strapi.services.game.findOne({ id });
    if (!game) {
      return ctx.notFound({ errorCode: "GAME_NOT_FOUND" });
    }
    if (game.status !== "published") {
      return ctx.badRequest({ errorCode: "NOT_PUBLISHED" });
    }

    const body = ctx.request.body;
    if (!body.character) {
      return ctx.badRequest({ errorCode: "MISSING_CHARACTER" });
    }
    const character = await strapi.services.character.findOne({
      id: body.character,
    });
    if (!character) {
      return ctx.notFound({ errorCode: "CHARACTER_NOT_FOUND" });
    }

    const payload = {
      game: game.id,
      character: character.id,
      player: character.player.id,
      applier: user.id,
      remarks: body.remarks,
    };

    const createdSignUp = await strapi.services["game-sign-up"].create(payload);

    return sanitizeEntity(createdSignUp, {
      model: strapi.models["game-sign-up"],
    });
  },

  async getChecklists(ctx) {
    const trelloBot = strapi.services.trelloBot;

    const { id } = ctx.params;
    const game = await strapi.services.game.findOne({ id });

    if (game && game.trelloCardId) {
      try {
        return trelloBot.getCheckListsByCardId(game.trelloCardId);
      } catch (e) {
        return [];
      }
    }

    return [];
  },

  async getCharacters(ctx) {
    const { id } = ctx.params;

    const aggregate = strapi.query("game-sign-up").model.aggregate();
    aggregate.match({
      game: ObjectId(id),
      status: "accepted",
    });
    aggregate.lookup({
      from: strapi.models["character"].collectionName,
      let: { character: "$character" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$_id", "$$character"] }],
            },
          },
        },

        {
          $lookup: {
            from: strapi.plugins["upload"].models["file"].collectionName,
            let: { portraitImage: "$portraitImage" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$portraitImage"] }],
                  },
                },
              },
            ],
            as: "portraitImage",
          },
        },

        {
          $unwind: {
            path: "$portraitImage",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            id: "$_id",
            _id: 1,
            name: 1,
            nickname: 1,
            portraitImage: 1,
          },
        },
      ],
      as: "character",
    });
    aggregate.unwind("character");

    const gameSignUps = await aggregate.exec();

    return gameSignUps.map((gameSignUp) => gameSignUp.character);
  },
};
