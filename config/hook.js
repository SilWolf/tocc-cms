module.exports = {
  settings: {
    telegramBot: {
      enabled: true,
      publicUrl: process.env.PUBLIC_URL,
      token: process.env.TELEGRAM_BOT_TOKEN,
      urlSecret: process.env.TELEGRAM_BOT_URL_SECRET,
    },
    googleCalendarBot: {
      enabled: true,
      privateKey: process.env.GOOGLE_CALENDAR_BOT_PRIVATE_KEY,
      clientEmail: process.env.GOOGLE_CALENDAR_BOT_CLIENT_EMAIL,
      calendarId: process.env.GOOGLE_CALENDAR_BOT_CALENDAR_ID,
    },
    trelloBot: {
      enabled: true,
      apiKey: process.env.TRELLO_BOT_API_KEY,
      token: process.env.TRELLO_BOT_TOKEN,
      pendingGameListId: process.env.TRELLO_BOT_PENDING_GAME_LIST_ID,
      finishedGameListId: process.env.TRELLO_BOT_FINISHED_GAME_LIST_ID,
    },
  },
};
