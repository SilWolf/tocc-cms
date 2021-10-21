"use strict";

const mongoose = require("mongoose");
const { formatGameToDescription } = require("../../game/helpers/game");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const TG_BIND_WAITING_FOR_ACCOUNT_ID = "TG_BIND_WAITING_FOR_ACCOUNT_ID";
const TG_BIND_WAITING_FOR_VALIDATION_CODE =
  "TG_BIND_WAITING_FOR_VALIDATION_CODE";

module.exports = {
  async index(ctx) {
    console.log(ctx.request.body);
    ctx.response.status = 200;

    const bot = strapi.services.telegramBot;
    const cache = strapi.services.telegramBotCache;

    const userService = strapi.plugins["users-permissions"].services["user"];

    let chat = { id: "" };

    const replyChat = (text) =>
      bot.sendMessage(chat.id, text, { parse_mode: "HTML" });

    const { message, callback_query: callbackQuery } = ctx.request.body;

    if (callbackQuery) {
      chat.id = callbackQuery.message.chat.id;

      bot.answerCallbackQuery(callbackQuery.id);

      const [key, value] = callbackQuery.data.split(":");

      if (key === "character") {
        const character = await strapi.services["character"].findOne({
          id: value,
        });
        if (!character) {
          bot.editMessageText(["錯誤:未能讀取角色。"].join("\n"), {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
          });
        }

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
      } else if (key === "signUpForGame") {
        const game = await strapi.services["game"].findOne({ id: value });
        if (!game) {
          replyChat(["錯誤:末能找到遊戲，或遊戲報名已結束。"].join("\n"));
          return;
        }

        const youAreSigningUpMessage = `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n你正在報名 <b>[${game.code}]${game.title}</b>`;

        const player = await userService.fetch({
          telegramUserId: callbackQuery.from.id,
        });
        if (!player) {
          replyChat(
            youAreSigningUpMessage +
              "\n你必須先綁定帳號才能報名！\n/bind - 綁定帳號"
          );
          return;
        }

        const signUp = await strapi.services["game-sign-up"].findOne({
          player: player.id,
          game: game.id,
        });

        if (signUp) {
          if (signUp.status === "pending") {
            replyChat(
              youAreSigningUpMessage +
                "\n您已經提交報名申請了，請耐心等待DM確認你的申請。"
            );
          } else if (signUp.status === "accepted") {
            replyChat(
              [
                youAreSigningUpMessage,
                "你已成功報名，請記得出席遊戲哦 >.0",
                "--------------------",
                formatGameToDescription(game),
              ].join("\n")
            );
          } else if (signUp.status === "rejected") {
            replyChat(
              [
                youAreSigningUpMessage,
                "抱歉，DM拒絕了你的報名",
                signUp.remarks,
              ].join("\n")
            );
          }
          return;
        }

        const characters = await strapi.services["character"].find({
          player: player.id,
        });

        if (!characters || characters.length <= 0) {
          replyChat(youAreSigningUpMessage + "\n你沒有可供報名的角色。");
          return;
        }

        bot.sendMessage(
          callbackQuery.message.chat.id,
          [youAreSigningUpMessage, "", "請選擇欲參與的角色"].join("\n"),
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: characters.map((character) => [
                {
                  text: `[${character.code}] ${character.name}`,
                  callback_data: `sufgChar:${game.id},${character.id}`,
                },
              ]),
            },
          }
        );
      } else if (key === "sufgChar") {
        const [gameId, characterId] = value.split(",");

        const game = await strapi.services["game"].findOne({ id: gameId });
        if (!game) {
          bot.editMessageText(
            ["錯誤:末能找到遊戲，或遊戲報名已結束。"].join("\n"),
            {
              chat_id: callbackQuery.message.chat.id,
              message_id: callbackQuery.message.message_id,
            }
          );
          return;
        }

        const youAreSigningUpMessage = `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n你正在報名 <b>[${game.code}]${game.title}</b>`;

        const character = await strapi.services["character"].findOne({
          id: characterId,
        });
        if (!character) {
          bot.editMessageText(
            youAreSigningUpMessage + "\n錯誤:所選角色無法報名。",
            {
              parse_mode: "HTML",
              chat_id: callbackQuery.message.chat.id,
              message_id: callbackQuery.message.message_id,
            }
          );
          return;
        }

        let signUp = await strapi.services["game-sign-up"].findOne({
          player: character.player.id,
          game: game.id,
        });

        if (signUp) {
          if (signUp.status === "pending") {
            replyChat(
              youAreSigningUpMessage +
                "\n您已經提交報名申請了，請耐心等待DM確認你的申請。"
            );
          } else if (signUp.status === "accepted") {
            replyChat(
              [
                youAreSigningUpMessage,
                "你已成功報名，請記得出席遊戲哦 >.0",
                "--------------------",
                formatGameToDescription(game),
              ].join("\n")
            );
          } else if (signUp.status === "rejected") {
            replyChat(
              [
                youAreSigningUpMessage,
                "抱歉，DM拒絕了你的報名",
                signUp.remarks,
              ].join("\n")
            );
          }
          return;
        }

        signUp = await strapi.services["game-sign-up"].create({
          player: character.player.id,
          character: character.id,
          game: game.id,
          status: "pending",
          remarks: "",
        });

        bot.editMessageText(
          `＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n<b>[${game.code}]${game.title}</b> 的報名申請已提交！\n當DM確認你的報名後，我會再通知你～\n謝謝你的支持和參與！\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝`,
          {
            parse_mode: "HTML",
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
          }
        );

        if (game.dm.telegramChatId) {
          const signUpSummary = await strapi.services["game-sign-up"].summary({
            game: mongoose.Types.ObjectId(game.id),
          });
          console.log(signUpSummary);
          bot.sendMessage(
            game.dm.telegramChatId,
            [
              `[通知] 有新玩家報名了 <b>[${game.code}] ${game.title}</b>`,
              `已確認:${signUpSummary.accepted}/${game.capacityMax} | 待確認:${signUpSummary.pending} | 拒絕:${signUpSummary.rejected}`,
              `-----------------------------------`,
              `玩家: ${character.player.name} (${character.player.code})`,
              `角色: ${character.name} (${character.code})`,
            ].join("\n"),
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `確認報名`,
                      callback_data: `acceptSignUp:${signUp.id}`,
                    },
                  ],
                ],
              },
            }
          );
        }
      }
    }

    if (!message) {
      return;
    }
    const { text: inputText, from: foreignUser } = message;
    chat.id = message.chat.id;

    // 指令
    if (inputText === "/start") {
      replyChat(
        [
          "你好，歡迎使用Tales of Coastal Cities的Telegram插件！",
          "",
          "我們致力提供優秀的TRPG遊戲，透過此插件，你即能訂閱我們最新舉行的遊戲、一鍵報名遊戲，使你不再錯過任何冒險時刻！",
          "",
          "請點擊 /bind 來綁定你的遊戲帳號。",
        ].join("\n")
      );
    } else if (inputText === "/help") {
      replyChat(
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
    } else if (inputText === "/bind") {
      const player = await userService.fetch({
        telegramUserId: foreignUser.id,
      });

      if (player) {
        replyChat(
          "你已經綁定了一個帳號。假如在帳號管理上遇到疑難，請聯絡DM以獲得協助。"
        );
        return;
      }

      replyChat("請輸入帳號ID\ne.g. <b>GO-00030</b>");
      cache[chat.id] = { status: TG_BIND_WAITING_FOR_ACCOUNT_ID };
    } else if (inputText === "/characters") {
      const player = await userService.fetch({
        telegramUserId: foreignUser.id,
      });
      if (!player) {
        replyChat("你必須先綁定帳號才能查閱自己的角色！\n/bind - 綁定帳號");
        return;
      }

      const characters = await strapi.services["character"].find({
        player: player.id,
      });

      if (!characters || characters.length <= 0) {
        replyChat("你沒有角色。");
        return;
      }

      bot.sendMessage(chat.id, "點選你想查看的角色：", {
        reply_markup: {
          inline_keyboard: characters.map((character) => [
            {
              text: `[${character.code}] ${character.name}`,
              callback_data: `character:${character.id}`,
            },
          ]),
        },
      });
    } else {
      // 隨機內容 根據cache狀態改變回應
      const cached = cache[chat.id];

      if (cached) {
        if (cached.status === TG_BIND_WAITING_FOR_ACCOUNT_ID) {
          const player = await userService.fetch({ code: inputText });

          if (!player) {
            replyChat("帳號不正確，請重新輸入帳號ID\ne.g. <b>GO-00030</b>");
            return;
          }

          if (player.telegramUserId) {
            replyChat(
              "錯誤: 你所輸入的帳號已與其他玩家綁定，操作取消。\n假如在帳號管理上遇到疑難，請聯絡DM以獲得協助。"
            );
            cache[foreignUser.id] = undefined;
            return;
          }

          cache[foreignUser.id] = {
            status: TG_BIND_WAITING_FOR_VALIDATION_CODE,
            data: {
              playerId: player.id,
            },
          };
          replyChat(
            "請輸入六位數字的驗證碼，以確認你是帳號持有人。\n在登記帳號時，DM應該已向你提供這個驗證碼了。\ne.g. <b>123456</b>"
          );
        } else if (cached.status === TG_BIND_WAITING_FOR_VALIDATION_CODE) {
          if (!cached.data || !cached.data.playerId) {
            replyChat("發生未知錯誤，請重新操作。");
            cache[foreignUser.id] = undefined;
            return;
          }

          const player = await userService.fetch({
            id: cached.data.playerId,
            telegramValidationCode: inputText,
          });
          if (!player) {
            replyChat("驗證碼不正確，請重新輸入\ne.g. <b>123456</b>");
            return;
          }

          replyChat(
            [
              "你已成功綁定帳號，從現在起如果有新的遊戲，Bot就會提示你哦！",
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
          cache[foreignUser.id] = undefined;
        }
      }
    }

    return;
  },
};
