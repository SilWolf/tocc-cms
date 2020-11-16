"use strict";

function sum(numbers) {
  let output = 0;
  for (let n of numbers) {
    try {
      output += n;
    } catch {
      //
    }
  }
  return output;
}

function transform(data) {
  console.log(JSON.stringify(data, null, 2));
  data.race = data.raceConfig.race;
  data.classes = data.classConfigs.map((_) => _.class);
  data.level = sum(data.classConfigs.map((_) => _.level));
}
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

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
