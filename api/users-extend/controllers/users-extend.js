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
};
