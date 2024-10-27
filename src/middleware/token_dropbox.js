const axios = require('axios');
require('dotenv').config();
const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');

let accessToken = ''; // Inicializa sem valor para armazenar o access token

async function renewAccessToken() {
    try {
        const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: process.env.DROPBOX_TOKEN,
                client_id: process.env.DROPBOX_CLIENT_ID,
                client_secret: process.env.DROPBOX_CLIENT_SECRET
            }
        });
        accessToken = response.data.access_token; // Armazena o novo token em memória
        console.log('Novo access token gerado:', accessToken);
    } catch (error) {
        console.error('Erro ao renovar o access token:', error);
    }
}

async function callDropboxAPI() {
    if (!accessToken) await renewAccessToken(); // Renova o token caso ele não exista

    try {
        const response = await axios.get('https://api.dropboxapi.com/2/files/list_folder', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: { path: '' } // Exemplo de chamada para listar diretórios
        });
        return response.data;
    } catch (error) {
        // Se o erro for de autenticação, renove o token e tente novamente
        if (error.response && error.response.status === 401) {
            await renewAccessToken();
            return callDropboxAPI(); // Rechama a função após renovar o token
        } else {
            console.error('Erro ao acessar a API do Dropbox:', error);
            throw error;
        }
    }
}

module.exports = accessToken; // Exporta o token para ser utilizado em outros módulos