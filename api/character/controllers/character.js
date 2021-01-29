"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async me(ctx) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const query = {
      player: user.id,
    };

    const entities = await strapi.services.character.find(query);
    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.character })
    );
  },
};
