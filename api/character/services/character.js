"use strict";

const { convertRestQueryParams, buildQuery } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const findOrSearchFn = (params) => {
  console.log(params);
  const { _q, ...rest } = params;
  return buildQuery({
    model: strapi.query("character").model,
    filters: convertRestQueryParams(rest),
    searchParam: _q,
    populate: [
      {
        path: "player",
        select: "id name code",
      },
      {
        path: "city",
        select: "id name code",
      },
      {
        path: "race",
        select: "id name code",
      },
      {
        path: "background",
        select: "id name code",
      },
      {
        path: "deity",
        select: "id name code",
      },
    ],
  }).select("_id name nickname level levelWithClsesString");
};

module.exports = {
  find(params, populate) {
    console.log(params);
    return findOrSearchFn(params);
  },
  search(params, populate) {
    return findOrSearchFn(params);
  },

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
