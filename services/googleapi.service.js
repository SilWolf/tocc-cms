const { google } = require("googleapis");

const defaultScopes = [];

const getAuth = ({ scopes, privateKey, clientEmail }) =>
  new google.auth.GoogleAuth({
    credentials: {
      private_key:
        privateKey || process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      client_email: clientEmail || process.env.GOOGLE_API_CLIENT_EMAIL,
    },
    scopes: scopes || defaultScopes,
  });

module.exports = {
  getAuth,
};
