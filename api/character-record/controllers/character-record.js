"use strict";

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  patchToAccepted: async (ctx) => {
    const { id } = ctx.params;
    const characterRecord = await strapi
      .query("character-record")
      .model.findOne({ _id: ObjectId(id) });
    if (!characterRecord) {
      return ctx.notFound();
    }

    const character = await strapi.services["character"].findOne({
      id: characterRecord.character,
    });
    if (!character) {
      return ctx.notFound();
    }

    const { gp: recordGp, xp: recordXp, ...others } = characterRecord.reward;
    const patchPayload = {
      gp: character.gp || 0,
      xp: character.xp || 0,
      attribute: {
        ...character.attribute,
      },
    };

    if (recordGp) {
      patchPayload.gp += recordGp.amount;
    }
    if (recordXp) {
      patchPayload.xp += recordXp.amount;
    }

    for (const attributeKey in others) {
      if (patchPayload.attribute[attributeKey] === undefined) {
        patchPayload.attribute[attributeKey] = 0;
      }
      patchPayload.attribute[attributeKey] += others[attributeKey].amount;
    }

    await strapi.services["character"].update(
      { id: character.id },
      patchPayload
    );
    await strapi.services["character-record"].update(
      { id: characterRecord.id },
      { status: "accepted" }
    );

    return {};
  },
};
