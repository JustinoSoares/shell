const axios = require("axios");
require("dotenv").config();
const dropboxV2Api = require("dropbox-v2-api");
const fs = require("fs");

const fetch = require("node-fetch");
module.exports = {
  refreshAccessToken: async (refreshToken) => {
    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET
      }
    });
    return response.data.access_token;
  }
};

//const token = refreshAccessToken(process.env.DROPBOX_REFRESH_TOKEN);
