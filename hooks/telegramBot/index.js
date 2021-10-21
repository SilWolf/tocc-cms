const _TelegramBot = require("node-telegram-bot-api");

module.exports = (strapi) => {
  return {
    async initialize() {
      const { apiEndpoint, token, urlSecret } = strapi.config.get(
        "hook.settings.telegramBot"
      );
      const bot = new _TelegramBot(token, { polling: false });

      bot.setWebHook(`${apiEndpoint}/telegram/${urlSecret}`);

      strapi.services.telegramBot = bot;
      strapi.services.telegramBotCache = {};
    },
  };
};
