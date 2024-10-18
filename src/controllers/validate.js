const express = require('express')
const fs = require('fs')
const { execFile } = require('child_process')
const axios = require('axios')
const Ex = require('../models/exercice')
const User = require('../models/users')
const Exercice = require('../models/exercice')
const User_ex = require('../models/user_has_ex')
const ExerciseActivity = require('../models/activity');

async function registerExercise(userId, points) {
  const today = new Date(); // Data de hoje
  try {
    const activity = await ExerciseActivity.create({
      userId: userId,
      date: today,
      points: points,
    });
    console.log('Atividade registrada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
}

module.exports = {
  validate: async (req, res) => {
    const exId = req.params.exId
    const ex = await Exercice.findByPk(exId)
    const user = await User.findByPk(req.userId)
    const conteudo = req.body.content
    const response = await Ex.findByPk(exId)
    execFile(
      `./${response.tester}`, [conteudo],
      async (error, stdout, stderr) => {
        if (error) {
          return res.json({
            status: 'error',
            msg: error
          })
        }
        // Se houver algum erro no stderr
        if (stderr) {
          const simplifiedError = stderr
            .replace(/\/.*\//g, '') // Remove caminho de diretórios
            .replace(/:\s\d+:\s/g, ': ') // Remove números de linha
          return res.json({
            status: 'error',
            msg: simplifiedError
          })
        }
        // Imprime a saída do script
        if (stdout.split(' ')[0] == 'OK') {
          const user_ex = await User_ex.findAll({
            where: {
              userId: req.userId,
              exId: req.params.exId
            }
          })
          if (!user_ex.length) {
            // Aumentar o número de pessoas que resolveram
            ex.resolvidos += 1
            //Aumentar a quantidade de fezes que um usuário resolveu
            user.resolvidos += 1
            //Aumentar o nível
            user.pontos += ex.nivel
           registerExercise(req.userId, 1);
            await User_ex.create({
              userId: req.userId,
              exId: req.params.exId,
              feito: true
            })
            await ex.save()
            await user.save()
          }
          return res.json({
            status: 'OK',
            msg: stdout.split(' ').slice(2).join(' ')
          })
        } else {
          return res.json({
            status: 'KO',
            msg: stdout.split(' ').slice(2).join(' ')
          })
        }
      }
    )
  }
}
