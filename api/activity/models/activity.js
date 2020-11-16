"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

function transform(data) {
  console.log(data);

  data.characters = data.characterRewards
    .filter((_) => _.character)
    .map((_) => _.character);
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      transform(data);
    },
    async beforeUpdate(_, data) {
      transform(data);
    },
  },
};
