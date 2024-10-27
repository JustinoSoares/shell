const axios = require("axios");
require("dotenv").config();
const dropboxV2Api = require("dropbox-v2-api");
const fs = require("fs");

const fetch = require("node-fetch");
module.exports = {
  refreshAccessToken: async (refreshToken) => {
    const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${process.env.DROPBOX_CLIENT_ID}&client_secret=${process.env.DROPBOX_CLIENT_SECRET}`,
    });

    if (!response.ok) {
      throw new Error(`Erro ao renovar token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token; // Novo access token
  },
};

//const token = refreshAccessToken(process.env.DROPBOX_REFRESH_TOKEN);
