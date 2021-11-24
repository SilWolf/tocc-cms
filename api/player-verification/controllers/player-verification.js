"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findOne: async (ctx) => {
    const { id } = ctx.params;

    const pv = await strapi.services["player-verification"].findOne({
      verificationCode: id,
      isRegistered: false,
    });
    if (!pv) {
      return ctx.notFound();
    }

    return sanitizeEntity(pv, { model: strapi.models["player-verification"] });
  },

  register: async (ctx) => {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.forbidden();
    }

    const { id } = ctx.params;
    const { name, nickname, email } = ctx.request.body;

    const pv = await strapi.services["player-verification"].findOne({
      verificationCode: id,
      isRegistered: false,
    });
    if (!pv) {
      return ctx.notFound();
    }

    const playerRole = await strapi.plugins["users-permissions"].services[
      "userspermissions"
    ]
      .getRoles()
      .then((roles) => {
        console.log(roles);
        return roles.find((role) => role.name === "Player");
      });

    if (!playerRole) {
      return ctx.internalServerError();
    }

    const patchPayload = {
      code: pv.playerCode,
      name,
      nickname,
      email,
      city: pv.city.id,
      role: playerRole.id,
    };

    const newUser = await strapi.plugins["users-permissions"].services[
      "user"
    ].edit({ _id: user._id }, patchPayload);

    for (const character of pv.characters) {
      await strapi.services["character"].update(
        { id: character.id },
        {
          player: user._id,
        }
      );
    }

    await strapi.services["player-verification"].update(
      { id: pv.id },
      {
        isRegistered: true,
        registeredAt: new Date().toISOString(),
      }
    );

    return newUser;
  },
};
