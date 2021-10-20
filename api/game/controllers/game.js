"use strict";

const { sanitizeEntity } = require("strapi-utils");

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
        ...entity,
        status: "published",
        publishedAt: new Date().toISOString(),
        worldEndAt: entity.worldStartAt,
      }
    );

    const output = sanitizeEntity(updatedEntity, { model: strapi.models.game });

    return output;
  },

  async patchToCompleted(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.game.findOne({ id });
    if (entity.status !== "published") {
      return ctx.badRequest();
    }

    (entity.characterAndRewards || []).forEach((cr) => {
      strapi.services["character-log"].create({
        character: cr.character,
        description: `${entity.code} - ${entity.title} 獎勵`,
        xp: cr.xp,
        gp: cr.gp,
        items: cr.items,
        remark: cr.remark,
        worldStartAt: entity.worldStartAt,
        worldEndAt: entity.worldEndAt,
        game: entity.id,
      });
    });

    const updatedEntity = await strapi.services.game.update(
      { id },
      {
        ...entity,
        status: "completed",
        completedAt: new Date().toISOString(),
      }
    );

    return sanitizeEntity(updatedEntity, { model: strapi.models.game });
  },
};
