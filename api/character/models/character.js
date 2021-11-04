"use strict";

async function transform(data) {
  // data.race = data.raceConfig.race;
  // data.classes = data.classConfigs.map((_) => _.class);
  // data.level = sum(data.classConfigs.map((_) => _.level));

  if (data.clses) {
    const clses = await Promise.all(
      data.clses.map((clsId) => strapi.services["cls"].findOne({ id: clsId }))
    );

    const lvWithClses = {};
    for (const cls of clses) {
      if (cls.parentCls) {
        if (!lvWithClses[cls.parentCls.name]) {
          lvWithClses[cls.parentCls.name] = cls.level;
        } else {
          lvWithClses[cls.parentCls.name] =
            cls.level > lvWithClses[cls.parentCls.name]
              ? cls.level
              : lvWithClses;
        }
      }
    }

    data.level = data.clses.length;
    data.levelWithClsesString =
      clses.length === 0
        ? "無職業"
        : Object.entries(lvWithClses)
            .sort((a, b) => (a[1] < b[1] ? 1 : b[1] < a[1] ? -1 : 0))
            .map(([key, value]) => `${key}${value}`)
            .join(" / ");
  }
}
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await transform(data);
    },
    async beforeUpdate(_, data) {
      await transform(data);
    },
  },
};
