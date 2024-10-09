const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const axios = require('axios')
const Ex = require('../models/exercice')
const User = require('../models/users')
const Exercice = require('../models/exercice')

module.exports = {
  validate: async (req, res) => {
    const exId = req.params.exId
    const ex = await Exercice.findByPk(exId)
    const user = await User.findByPk(req.userId)
    const caminho = `build/${user.name}`
    const conteudo = req.body.content

    try {
      fs.writeFileSync(caminho, conteudo)
    } catch (error) {
      return res.json({
        msg: "Error"
      });
    }
    const response = await Ex.findByPk(exId)
    exec(`sh ./${response.tester} ${user.name}`, (error, stdout, stderr) => {
      if (error) {
        return res.json({
          status: 'error',
          msg: error
        })
      }
      // Se houver algum erro no stderr
      if (stderr) {
        return res.json({
          status: 'false',
          msg: stderr
        })
      }
      // Imprime a saída do script
      if (stdout == 'OK\n') {
        ex.resolvidos += 1
        user.resolvidos += 1
        user.pontos += ex.nivel
        ex.save()
        user.save()
        return res.json({
          status: 'true',
          msg: 'OK'
        })
      } else {
        return res.json({
          msg: stdout
        })
      }
    })
  }
}
