"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async attachable(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.attachable.findOne({ background: id });
    return sanitizeEntity(entity, { model: strapi.models.attachable });
  },
};
