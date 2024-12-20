const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const axios = require("axios");
const Ex = require("../models/exercice");
const User = require("../models/users");
const Exercice = require("../models/exercice");
const User_ex = require("../models/user_has_ex");
const ExerciseActivity = require("../models/activity");
const { Dropbox } = require("dropbox");
const token_dropbox = require("../middleware/token_dropbox");
require("dotenv").config();

async function registerExercise(userId, points) {
  const today = new Date(); // Data de hoje
  try {
    const activity = await ExerciseActivity.create({
      userId: userId,
      date: today,
      points: points,
    });
    console.log("Atividade registrada com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}

function getFileNameFromUrl(url) {
  // Usando o método split() para separar a URL pelos '/'
  const parts = url.split("/");

  // Pegando a última parte da URL que contém o nome do arquivo e os parâmetros
  const lastPart = parts[parts.length - 1];

  // Usando split() novamente para separar os parâmetros a partir de '?'
  const fileName = lastPart.split("?")[0];

  return fileName;
}

module.exports = {
  validate: async (req, res) => {
    const exId = req.params.exId;
    const ex = await Exercice.findByPk(exId);
    const user = await User.findByPk(req.userId);
    const conteudo = req.body.content;
    const response = await Ex.findByPk(exId);
    const accessToken = await token_dropbox.refreshAccessToken(
      process.env.DROPBOX_REFRESH
    );
    const dbx = new Dropbox({ accessToken: accessToken, fetch });
    if (!response)
    {
      return res.status(404).json({
        status: "false",
        msg: "Exercício não encontrado",
      });
    }
    const command = `curl -L -o /tmp/${getFileNameFromUrl(response.tester)} '${
      response.tester
    }' > /dev/null 2>&1 &&  chmod +x /tmp/${getFileNameFromUrl(
      response.tester
    )} && /tmp/${getFileNameFromUrl(response.tester)} '${conteudo}'`;
    const localFilePath = `/tmp/${getFileNameFromUrl(response.tester)}`;
    // Salvar o arquivo localmente

    exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
      if (error) {
        if (localFilePath) {
          // Remover o arquivo local após o upload
          fs.unlink(localFilePath, (err) => {
            if (err) {
              console.error("Erro ao remover arquivo local:", err);
            }
          });
        }
        return res.json({
          status: "error",
          msg: error,
        });
      }
      // Se houver algum erro no stderr
      if (stderr) {
        const simplifiedError = stderr
          .replace(/\/.*\//g, "") // Remove caminho de diretórios
          .replace(/:\s\d+:\s/g, ": "); // Remove números de linha
        // Remover o arquivo local após o upload
        if (localFilePath) {
          // Remover o arquivo local após o upload
          fs.unlink(localFilePath, (err) => {
            if (err) {
              console.error("Erro ao remover arquivo local:", err);
            }
          });
        }
        return res.json({
          status: "error",
          response: "KO",
          msg: simplifiedError,
        });
      }
      // Imprime a saída do script
      if (stdout.split(" ")[0] == "OK") {
        const user_ex = await User_ex.findAll({
          where: {
            userId: req.userId,
            exId: req.params.exId,
          },
        });
        if (!user_ex.length) {
          // Aumentar o número de pessoas que resolveram
          ex.resolvidos += 1;
          //Aumentar a quantidade de fezes que um usuário resolveu
          user.resolvidos += 1;
          //Aumentar o nível
          user.pontos += ex.nivel;
          registerExercise(req.userId, 1);
          await User_ex.create({
            userId: req.userId,
            exId: req.params.exId,
            feito: true,
          });
          await ex.save();
          await user.save();
        }
        // Remover o arquivo local após o upload
        if (localFilePath) {
          // Remover o arquivo local após o upload
          fs.unlink(localFilePath, (err) => {
            if (err) {
              console.error("Erro ao remover arquivo local:", err);
            }
          });
        }
        return res.json({
          status: "true",
          response: "OK",
          msg: stdout.split(" ").slice(2).join(" "),
        });
      }
      if (localFilePath) {
        // Remover o arquivo local após o upload
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error("Erro ao remover arquivo local:", err);
          }
        });
      }
      return res.json({
        status: "true",
        response: "KO",
        msg: stdout.split(" ").slice(2).join(" "),
      });
    });
  },
};
