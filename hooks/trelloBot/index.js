const axios = require("axios");

module.exports = (strapi) => {
  return {
    async initialize() {
      const { apiKey, token, pendingGameListId, finishedGameListId } =
        strapi.config.get("hook.settings.trelloBot");

      const api = axios.create({
        baseURL: "https://api.trello.com/1",

        timeout: 30000,
      });
      api.interceptors.request.use((config) => {
        if (!config.params) {
          config.params = {};
        }
        config.params.key = apiKey;
        config.params.token = token;

        return config;
      });

      const bot = {
        getCardByGame: async (game) => {
          if (game.trelloCardId) {
            return api
              .get(`/cards/${game.trelloCardId}`)
              .then((res) => res.data);
          }

          return undefined;
        },

        createCard: async (payload) => {
          return api
            .post(`/cards`, {
              ...payload,
              idList: pendingGameListId,
            })
            .then((res) => res.data);
        },

        deleteCardById: async (id) => {
          return api.delete(`/cards/${id}`).then(() => {
            return true;
          });
        },

        getCheckListsByCardId: async (id) => {
          return api.get(`/cards/${id}/checklists`).then((res) => res.data);
        },

        createCheckListByCardId: async (id, payload) => {
          return api
            .post(`/cards/${id}/checklists`, payload)
            .then((res) => res.data)
            .catch((err) => {
              console.log(err);
              throw err;
            });
        },

        createCheckItemByCheckListId: async (id, payload) => {
          return api
            .post(`/checklists/${id}/checkItems`, payload)
            .then((res) => res.data);
        },

        getCheckListsByCardId: async (id) => {
          return api.get(`/cards/${id}/checklists`).then((res) => res.data);
        },
      };

      strapi.services.trelloBot = bot;
      strapi.services.trelloBotCache = {};
    },
  };
};
