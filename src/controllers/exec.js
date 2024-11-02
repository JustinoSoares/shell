const ModuleUser = require("../models/users");
const bcrypt = require("bcrypt");
const express = require("express");
const { body, validationResult } = require("express-validator");
const Exercice = require("../models/exercice");
const User_ex = require("../models/user_has_ex");
const { Sequelize, Op, where } = require("sequelize");
const User = require("../models/users");
const path = require("path");
const fs = require('fs');
const dropboxV2Api = require("dropbox-v2-api");
const axis = require("axios");
const token_dropbox = require("../middleware/token_dropbox");
require("dotenv").config();


module.exports = {
  each_ex: async (req, res) => {
    try {
      const ex = await Exercice.findByPk(req.params.exId);
      if (!ex) {
        return res.status(404).json({
          status: "false",
          msg: "Exercício não encontrado",
        });
      }
      res.status(201).json({
        status: "true",
        msg: "Exercício encontrado com sucesso",
        data: ex,
      });
    } catch (error) {
      return res.status(500).json({
        status: "false",
        msg: "Ocorreu um erro",
      });
    }
  },

  show_ex: async (req, res) => {
    const done = 0;
    const { categoria, limitMax, order_by, asc_desc } = req.query;
    const whereLimitMax = limitMax ? limitMax : "3";
    const whereOrderBy = order_by ? order_by : "createdAt";
    const whereAsc = asc_desc ? asc_desc : "desc";
    const whereCategoria = categoria ? { categoria } : {};
    try {
      const ex = await Exercice.findAll({
        where: whereCategoria,
        order: [[whereOrderBy, whereAsc]],
        limit: parseInt(whereLimitMax),
        include: [
          {
            model: User,
            through: {
              attributes: [], // Não queremos os atributos da tabela intermediária
            },
            where: {
              id: req.userId, // Filtramos para o usuário logado
            },
            required: false, // Isso permite que os exercícios sejam listados mesmo se o usuário não tiver completado
          },
        ],
      });
      if (!ex.length) {
        return res.status(404).json({
          status: "false",
          msg: "Nem um Exercício encontrado",
        });
      }
      const resultado = ex.map((exercicio, index) => ({
        id: exercicio.id,
        index: index + 1,
        name: exercicio.name,
        feito: exercicio.users.length > 0, // Se o usuário tem o exercício, então foi feito
        categoria: exercicio.categoria,
        resolvidos: exercicio.resolvidos,
      }));
      res.status(201).json({
        status: "true",
        msg: "Encontrado com sucesso",
        data: resultado,
      });
    } catch (error) {
      return res.status(500).json({
        status: "false",
        msg: "Ocorreu um erro",
      });
    }
  },

  create_ex: async (req, res) => {
    //Receber qualquer erro de validação
    const errors = validationResult(req);

    //Verificar se existe algum erro de validação se houver retornar
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          type: err.type,
          msg: err.msg,
          campo: err.path,
          valor: err.value,
        })),
      });
    }
    try {
      const { name, subject, nivel, categoria } = req.body;
      const accessToken = await token_dropbox.refreshAccessToken(process.env.DROPBOX_REFRESH);
      const dropbox = dropboxV2Api.authenticate({
        token: process.env.DROPBOX_TOKEN, // Certifique-se de ter o token do Dropbox configurado
      });
      // Caminho local do arquivo que foi feito upload com multer
      const localFilePath = req.file.path;

      // Definir o caminho no Dropbox para onde o arquivo será enviado
      const dropboxFilePath = `/uploads/${req.file.filename}`; // Pasta no Dropbox

      // Ler o arquivo local e enviar para o Dropbox
      const uploadFile = new Promise((resolve, reject) => {
        fs.createReadStream(localFilePath).pipe(
          dropbox(
            {
              resource: "files/upload",
              parameters: {
                path: dropboxFilePath,
                mode: "add",
                autorename: true,
                mute: false,
              },
            },
            (err, result) => {
              if (err) {
                reject(err); // Rejeitar a promessa em caso de erro
              } else {
                resolve(result); // Resolver a promessa com o resultado
              }
            }
          )
        );
      });

      const result = await uploadFile; // Espera o upload completar

      // Após o upload, gerar um link compartilhável
      const createSharedLink = new Promise((resolve, reject) => {
        dropbox(
          {
            resource: "sharing/create_shared_link_with_settings",
            parameters: {
              path: result.path_lower, // O caminho retornado no upload do arquivo
            },
          },
          (err, linkResult) => {
            if (err) {
              reject(err); // Rejeitar a promessa em caso de erro
            } else {
              resolve(linkResult); // Resolver a promessa com o link gerado
            }
          }
        );
      });

      const linkResult = await createSharedLink; // Espera o link ser gerado

      // Link compartilhável gerado
      const dropboxSharedLink = linkResult.url;
      // Salvar o link no banco de dados
      const replacedropboxSharedLink = dropboxSharedLink.replace(
        "dl=0",
        "dl=1"
      );
      const ex = await Exercice.create({
        name,
        subject,
        nivel,
        categoria,
        tester: replacedropboxSharedLink, // Salvar o link do Dropbox no banco de dados
      });

      // Remover o arquivo local após o upload
      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Erro ao remover arquivo local:", err);
        }
      });

      return res.status(201).json({
        message:
          "Exercicio criado com sucesso e arquivo enviado para o Dropbox!",
        ex,
      });
    } catch (error) {
      console.error("Erro ao criar exercício:", error);
      return res.status(500).json({ error: "Erro ao criar exercício.", error });
    }
  },

  update_ex: async (req, res) => {
    //Receber qualquer erro de validação
    const errors = validationResult(req);

    //Verificar se existe algum erro de validação se houver retornar
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          type: err.type,
          msg: err.msg,
          campo: err.path,
          valor: err.value,
        })),
      });
    }
    try {
      const { name, subject, nivel, categoria } = req.body;

      const ex = await Exercice.update({
        name,
        subject,
        nivel,
        categoria,
        tester: req.file.path,
      });
      res.status(201).json({
        status: "true",
        msg: "Exercice actualizado com sucesso",
        data: ex,
      });
    } catch (error) {
      return res.status(500).json({
        status: "false",
        msg: "Ocorreu um erro",
        mm: error,
      });
    }
  },

  delete_ex: async (req, res) => {
    try {
      const ex = await Exercice.findByPk(req.params.exId);
      if (!ex) {
        return res.status(404).json({
          status: "false",
          msg: "Não foi encontrado esse exercício",
        });
      }
      await ex.destroy();
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        msg: "Erro!",
      });
    }
  },
};
