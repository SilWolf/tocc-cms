"use strict";

const { sanitizeEntity } = require("strapi-utils");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { getResultsFromAggregateAndQuery } = require("../helpers");

/**
 * A set of functions called "actions" for `admin`
 */

module.exports = {
  findGames: async (ctx) => {
    const aggregate = strapi.query("game").model.aggregate();
    const result = await getResultsFromAggregateAndQuery(
      aggregate,
      ctx.query || {},
      [
        {
          $lookup: {
            from: strapi.plugins["users-permissions"].models["user"]
              .collectionName,
            let: { dm: "$dm" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$dm"] }],
                  },
                },
              },

              {
                $lookup: {
                  from: strapi.plugins["upload"].models["file"].collectionName,
                  let: { portraitImage: "$portraitImage" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $eq: ["$_id", "$$portraitImage"] }],
                        },
                      },
                    },
                  ],
                  as: "portraitImage",
                },
              },
              {
                $project: { _id: 1, displayName: 1, portraitImage: 1 },
              },
              {
                $unwind: {
                  path: "$portraitImage",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: "dm",
          },
        },
        {
          $unwind: { path: "$dm", preserveNullAndEmptyArrays: true },
        },
        {
          $project: { _id: 1, outline: -1, description: -1, remark: -1 },
        },
      ]
    );

    return result;
  },
};
