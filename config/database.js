module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI"),
        database: "tocc-cms-strapi",
      },
      options: {
        ssl: false,
      },
    },
  },
});
