const { sanitizeEntity } = require("strapi-utils");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  async getMyGameSignUpsByGameId(ctx) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.forbidden();
    }

    const { gameId } = ctx.params;
    const { _detail } = ctx.query;
    if (_detail) {
      const gameSignUps = await strapi.services["game-sign-up"].find({
        player: user.id,
        game: gameId,
      });

      return sanitizeEntity(gameSignUps, {
        model: strapi.models["game-sign-up"],
      });
    } else {
      const gameSignUps = await strapi
        .query("game-sign-up")
        .model.find(
          {
            player: ObjectId(user.id),
            game: ObjectId(gameId),
          },
          "_id createdAt status"
        )
        .exec();

      return gameSignUps;
    }
  },

  async getMyDMGames(ctx) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized({ errorCode: "NOT_AUTHORIZED" });
    }

    const gamesAggregate = strapi.query("game").model.aggregate();
    gamesAggregate.match({
      dm: ObjectId(user.id),
    });

    if (ctx.query._pending) {
      gamesAggregate.match({
        status: { $ne: "done" },
      });
    }

    gamesAggregate
      .lookup({
        from: strapi.models["game-sign-up"].collectionName,
        let: { game: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$game", "$$game"] }],
              },
            },
          },

          {
            $lookup: {
              from: strapi.plugins["users-permissions"].models["user"]
                .collectionName,
              let: { player: "$player" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$_id", "$$player"] }],
                    },
                  },
                },
              ],
              as: "player",
            },
          },
          {
            $unwind: { path: "$player", preserveNullAndEmptyArrays: true },
          },

          {
            $lookup: {
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
                    from: strapi.plugins["upload"].models["file"]
                      .collectionName,
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
              ],
              as: "character",
            },
          },
          {
            $unwind: { path: "$character", preserveNullAndEmptyArrays: true },
          },
        ],
        as: "gameSignUps",
      })

      .lookup({
        from: strapi.models["city"].collectionName,
        let: { city: "$city" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$city"] }],
              },
            },
          },
        ],
        as: "city",
      })
      .unwind({ path: "$city", preserveNullAndEmptyArrays: true })

      .exec();

    const games = await gamesAggregate.exec();

    return games;
  },
};
