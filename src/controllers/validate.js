const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const axios = require('axios')
const Ex = require('../models/exercice')
const User = require('../models/users')
const Exercice = require('../models/exercice')
const User_ex = require('../models/user_has_ex')

module.exports = {
  validate: async (req, res) => {
    const exId = req.params.exId
    const ex = await Exercice.findByPk(exId)
    const user = await User.findByPk(req.userId)
    const conteudo = req.body.content
    const response = await Ex.findByPk(exId)
    exec(`sh ./${response.tester} "${conteudo}"`, async (error, stdout, stderr) => {
      if (error) {
        return res.json({
          status: 'error',
          msg: error
        })
      }
      // Se houver algum erro no stderr
      if (stderr) {
        const simplifiedError = stderr
          .replace(/\/.*\//g, '')  // Remove caminho de diretórios
          .replace(/:\s\d+:\s/g, ': ');  // Remove números de linha
        return res.json({
          status: 'error',
          msg: simplifiedError,
        })
      }
      // Imprime a saída do script
      if (stdout == 'OK\n') {
        const user_ex = await User_ex.findAll({
          where: {
            userId: req.userId,
            exId: req.params.exId,
          }
        });
        if (!user_ex.length) {
          // Aumentar o número de pessoas que resolveram
          ex.resolvidos += 1
          //Aumentar a quantidade de fezes que um usuário resolveu
          user.resolvidos += 1
          //Aumentar o nível
          user.pontos += ex.nivel
          User_ex.create({
            userId: req.userId,
            exId: req.params.exId,
            feito: true
          })
          await ex.save()
          await user.save()
        }
        return res.json({
          status: 'OK',
          msg: "Aceite"
        })
      } else {
        return res.json({
          status: "KO",
          msg: "Recusado"
        })
      }
    })
  }
}
