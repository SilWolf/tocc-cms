"use strict";

const mongoose = require("mongoose");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  find(params, populate) {
    return strapi.query("city").find(params, []);
  },
  search(params) {
    return strapi.query("city").search(params, []);
  },

  async getAllCitiesCharactersCount() {
    return strapi
      .query("character")
      .model.aggregate()
      .match({
        city: { $ne: null },
      })
      .group({
        _id: "$city",
        sum: { $sum: 1 },
      })
      .exec()
      .then((results) =>
        results.reduce((prev, curr) => {
          prev[curr._id] = curr.sum;
          return prev;
        }, {})
      );
  },

  async getCityCharactersCount(cityId) {
    return strapi
      .query("character")
      .model.aggregate({
        $match: {
          _id: mongoose.Types.ObjectId(cityId),
        },
      })
      .group({
        _id: "$city",
        sum: { $sum: 1 },
      })
      .exec((results) => (results[0] ? results[0].sum : 0));
  },

  async getAllCitiesPlayersCount() {
    return strapi
      .query("user", "users-permissions")
      .model.aggregate()
      .match({
        city: { $ne: null },
      })
      .group({
        _id: "$city",
        sum: { $sum: 1 },
      })
      .exec()
      .then((results) =>
        results.reduce((prev, curr) => {
          prev[curr._id] = curr.sum;
          return prev;
        }, {})
      );
  },

  async getCityPlayersCount(cityId) {
    return strapi
      .query("user", "users-permissions")
      .model.aggregate()
      .match({
        city: mongoose.Types.ObjectId(cityId),
      })
      .group({
        _id: "$city",
        sum: { $sum: 1 },
      })
      .exec((results) => (results[0] ? results[0].sum : 0));
  },
};
