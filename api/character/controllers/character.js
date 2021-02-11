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

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.character.create(
        {
          ...data,
          player: user.id,
        },
        { files }
      );
    } else {
      entity = await strapi.services.character.create({
        ...ctx.request.body,
        player: user.id,
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
