module.exports = {
  settings: {
    telegramBot: {
      enabled: true,
      publicUrl: process.env.PUBLIC_URL,
      token: process.env.TELEGRAM_BOT_TOKEN,
      urlSecret: process.env.TELEGRAM_BOT_URL_SECRET,
    },
  },
};
