module.exports = {
  settings: {
    telegramBot: {
      enabled: true,
      apiEndpoint: process.env.API_ENDPOINT,
      token: process.env.TELEGRAM_BOT_TOKEN,
      urlSecret: process.env.TELEGRAM_BOT_URL_SECRET,
    },
  },
};
