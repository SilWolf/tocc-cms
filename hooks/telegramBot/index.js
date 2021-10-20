const _TelegramBot = require("node-telegram-bot-api");

const TG_BIND_WAITING_FOR_ACCOUNT_ID = "TG_BIND_WAITING_FOR_ACCOUNT_ID";
const TG_BIND_WAITING_FOR_VALIDATION_CODE =
  "TG_BIND_WAITING_FOR_VALIDATION_CODE";

module.exports = (strapi) => {
  return {
    async initialize() {
      const { token } = strapi.config.get("hook.settings.telegramBot");
      const bot = new _TelegramBot(token, { polling: true });

      const _generalSendMessage = (chatId, text) =>
        bot.sendMessage(chatId, text, { parse_mode: "HTML" });

      const cache = {};

      bot.onText(/^\/me/, (msg) => {
        const foreignUser = msg.from;
      });

      bot.onText(/^\/help/, (msg) => {
        _generalSendMessage(
          msg.chat.id,
          [
            "/games - 查閱正在開放報名的遊戲",
            "",
            "/me - 查閱我的帳號",
            "/characters - 查閱我的角色",
            "/my_games - 查閱我即將參與的遊戲",
            "/my_history - 查閱我參與過的舊遊戲",
            "",
            "/news - 最新消息",
            "/previous_games - 查閱舊遊戲",
          ].join("\n")
        );
      });

      bot.onText(/^\/characters/, async (msg) => {
        const player = await strapi.plugins["users-permissions"].services[
          "user"
        ].fetch({ telegramUserId: msg.from.id });

        if (!player) {
          _generalSendMessage(
            msg.chat.id,
            "你必須先綁定帳號才能查閱自己的角色！\n/bind - 綁定帳號"
          );
          return;
        }

        const characters = await strapi.services["character"].find({
          player: player.id,
        });

        if (!characters || characters.length <= 0) {
          _generalSendMessage(msg.chat.id, "你沒有角色。");
          return;
        }

        bot.sendMessage(msg.chat.id, "點選你想查看的角色：", {
          reply_markup: {
            inline_keyboard: characters.map((character) => [
              {
                text: character.name,
                callback_data: `character:${character.id}`,
              },
            ]),
          },
        });
      });

      bot.onText(/^\/綁定帳號/, async (msg) => {
        // check if msg foreignUser already bind to an account
        const foreignUser = msg.from;

        const account = await strapi.plugins["users-permissions"].services[
          "user"
        ].fetch({ telegramUserId: foreignUser.id });
        if (account) {
          _generalSendMessage(
            msg.chat.id,
            "你已經綁定了一個帳號。假如在帳號管理上遇到疑難，請聯絡DM以獲得協助。"
          );
          return;
        }

        _generalSendMessage(msg.chat.id, "請輸入帳號ID\ne.g. <b>GO-00030</b>");
        cache[foreignUser.id] = { status: TG_BIND_WAITING_FOR_ACCOUNT_ID };
      });

      // Listen for any kind of message. There are different kinds of
      // messages.
      bot.on("message", async (msg) => {
        if (msg.text[0] === "/") {
          // ignore command message
          return;
        }

        const chatId = msg.chat.id;
        const foreignUserId = msg.from.id;
        const cached = cache[foreignUserId];

        const _sendMessage = (text) => _generalSendMessage(msg.chat.id, text);

        if (!cache[foreignUserId]) {
          return;
        }

        if (cached.status === TG_BIND_WAITING_FOR_ACCOUNT_ID) {
          const account = await strapi.plugins["users-permissions"].services[
            "user"
          ].fetch({ code: msg.text });

          if (!account) {
            _sendMessage("帳號不正確，請重新輸入帳號ID\ne.g. <b>GO-00030</b>");
            return;
          }

          if (account.telegramUserId) {
            _sendMessage(
              "你所輸入的帳號已與其他玩家綁定，操作取消。假如在帳號管理上遇到疑難，請聯絡DM以獲得協助。"
            );
            cache[foreignUserId] = undefined;
            return;
          }

          cache[foreignUserId] = {
            status: TG_BIND_WAITING_FOR_VALIDATION_CODE,
            data: {
              accountCode: account.code,
            },
          };
          _sendMessage(
            "請輸入驗證用的六位數字密碼，你應該已經從DM處得到這個驗證碼了。\ne.g. <b>123456</b>"
          );
        } else if (cached.status === TG_BIND_WAITING_FOR_VALIDATION_CODE) {
          if (!cached.data || !cached.data.accountCode) {
            _sendMessage("發生未知錯誤，請重新操作。");
            cache[foreignUserId] = undefined;
            return;
          }

          const account = await strapi.plugins["users-permissions"].services[
            "user"
          ].fetch({
            code: cached.data.accountCode,
            telegramValidationCode: msg.text,
          });
          if (!account) {
            _sendMessage("驗證碼不正確，請重新輸入\ne.g. <b>123456</b>");
            return;
          }

          await strapi.plugins["users-permissions"].services["user"].edit(
            { id: account.id },
            { telegramUserId: foreignUserId, telegramChatId: chatId }
          );

          _sendMessage(
            [
              "你已成功綁定帳號。",
              "",
              "/games - 查閱正在開放報名的遊戲",
              "",
              "/me - 查閱我的帳號",
              "/characters - 查閱我的角色",
              "/my_games - 查閱我即將參與的遊戲",
              "/my_history - 查閱我參與過的舊遊戲",
              "",
              "/news - 最新消息",
              "/previous_games - 查閱舊遊戲",
            ].join("\n")
          );
          cache[foreignUserId] = undefined;
        }
      });

      bot.on("callback_query", async (callbackQuery) => {
        const [key, value] = callbackQuery.data.split(":");

        if (key === "character") {
          const character = await strapi.services["character"].findOne({
            id: value,
          });
          if (!character) {
            bot.editMessageText(["錯誤:未能讀取角色。"].join("\n"), {
              message_id: callbackQuery.id,
            });
          }
          if (character) {
            bot.editMessageText(
              [
                `<b>${character.name} [${character.code}]</b>`,
                `<b>${character.city.name}</b>`,
              ].join("\n"),
              {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                parse_mode: "HTML",
              }
            );
          }

          bot.answerCallbackQuery(callbackQuery.id);
        }
      });

      strapi.services.telegramBot = bot;
    },
  };
};
