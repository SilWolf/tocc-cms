"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async dmFind(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["city"].search(ctx.query);
    } else {
      entities = await strapi.services["city"].find(ctx.query);
    }

    entities = entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["city"] })
    );

    const [charactersCountMap, playersCountMap] = await Promise.all([
      strapi.services["city"].getAllCitiesCharactersCount(),
      strapi.services["city"].getAllCitiesPlayersCount(),
    ]);

    for (const entity of entities) {
      entity.charactersCount = charactersCountMap[entity._id] || 0;
      entity.playersCount = playersCountMap[entity._id] || 0;
    }

    return entities;
  },
};
