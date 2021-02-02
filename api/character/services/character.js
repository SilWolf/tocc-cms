"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async refreshXpAndGp(id) {
    try {
      const cLogs = await strapi.services["character-log"].find({
        character: id,
      });
      const query = cLogs.reduce(
        (prev, curr) => {
          prev.xp += curr.xp;
          prev.gp += curr.gp;

          return prev;
        },
        {
          xp: 0,
          gp: 0,
        }
      );

      return strapi.services.character.update({ id }, query);
    } catch (err) {
      console.error(err);
    }
  },
};
