"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async summary(params) {
    return strapi
      .query("game-sign-up")
      .model.aggregate()
      .match(params)
      .group({ _id: "$status", count: { $sum: 1 } })
      .exec()
      .then((results) =>
        results.reduce(
          (prev, item) => {
            prev[item._id] = item.count;
            return prev;
          },
          {
            pending: 0,
            accepted: 0,
            rejected: 0,
          }
        )
      );
  },
};
