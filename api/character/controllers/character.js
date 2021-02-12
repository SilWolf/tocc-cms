"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.forbidden();
    }

    // get total number of characters owned by player
    const characterCount = await strapi.services.character.count({
      player: user.id,
    });

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.character.create(
        {
          ...data,
          player: user.id,
          code: `${user.code}-NEW${(characterCount + 1)
            .toString()
            .padStart(2, "0")}`,
        },
        { files }
      );
    } else {
      entity = await strapi.services.character.create({
        ...ctx.request.body,
        player: user.id,
        code: `${user.code}-NEW${(characterCount + 1)
          .toString()
          .padStart(2, "0")}`,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.character });
  },

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

  async logs(ctx) {
    const { id } = ctx.params;

    const entities = await strapi.services["character-log"].find(
      {
        character: id,
        _sort: "createdAt:DESC",
        _limit: 10,
      },
      ["game"]
    );

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["character-log"] })
    );
  },

  async getDetail(ctx) {
    const { id } = ctx.params;

    const entities = await strapi.services["character-detail"].findOne(
      {
        character: id,
      },
      [""]
    );

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["character-detail"] })
    );
  },

  async postDetail(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services["character-detail"].create({
      ...ctx.request.body,
      character: id,
    });
    return sanitizeEntity(entity, { model: strapi.models["character-detail"] });
  },
};
