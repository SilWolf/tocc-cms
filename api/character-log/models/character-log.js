"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate(log) {
      strapi.services.character.refreshXpAndGp(log.character);
    },
    afterUpdate(log) {
      strapi.services.character.refreshXpAndGp(log.character);
    },
    afterDelete(log) {
      strapi.services.character.refreshXpAndGp(log.character);
    },
  },
};
