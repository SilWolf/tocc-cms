module.exports = async (ctx, next) => {
  if (ctx.params && ctx.params.secret === process.env.TELEGRAM_BOT_URL_SECRET) {
    next();
    return;
  }

  ctx.unauthorized(`Incorrect secret.`);
};
