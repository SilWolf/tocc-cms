"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getDnd5eRulesetAttachable() {
    const entity = await strapi.services.attachable.findOne({
      code: "ruleset:dnd5e",
    });
    return sanitizeEntity(entity, { model: strapi.models.attachable });
  },
};
