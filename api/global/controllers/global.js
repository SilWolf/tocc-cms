"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * A set of functions called "actions" for `global`
 */

module.exports = {
  async search(ctx) {
    const { _q } = ctx.query;

    console.log(strapi.plugins["users-permissions"].services.user);

    return await Promise.all([
      strapi.query("character").search({ _q, _limit: 3 }, []),
      strapi.query("game").search({ _q, _limit: 3 }, []),
      strapi.query("user", "users-permissions").search({ _q, _limit: 3 }, []),
    ]).then(([characters, games, users]) => ({
      characters: characters.map((character) =>
        sanitizeEntity(character, { model: strapi.models.character })
      ),
      games: games.map((game) =>
        sanitizeEntity(game, { model: strapi.models.game })
      ),
      users: users.map((user) =>
        sanitizeEntity(user, {
          model: strapi.query("user", "users-permissions").model,
        })
      ),
    }));
  },
};
