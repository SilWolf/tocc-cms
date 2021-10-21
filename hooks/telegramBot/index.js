const _TelegramBot = require("node-telegram-bot-api");

module.exports = (strapi) => {
  return {
    async initialize() {
      const { publicUrl, token, urlSecret } = strapi.config.get(
        "hook.settings.telegramBot"
      );
      const bot = new _TelegramBot(token, { polling: false });

      bot.setWebHook(`${publicUrl}/telegram/${urlSecret}`);

      strapi.services.telegramBot = bot;
      strapi.services.telegramBotCache = {};
    },
  };
};
