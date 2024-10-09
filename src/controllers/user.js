const ModuleUser = require('../models/users')
const bcrypt = require('bcrypt')
const express = require('express')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

module.exports = {
  // criar users
  create: async (req, res) => {
    // function cryptografia
    async function hashPassword (password) {
      const saltsRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltsRounds)
      return hashedPassword
    }

    //Receber qualquer erro de validação
    const errors = validationResult(req);

    //Verificar se existe algum erro de validação se houver retornar
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => ({
          type: err.type,
          msg: err.msg,
          campo: err.path,
          valor: err.value
        }))
      })
    }

    try {
      const { name, email, password, pais } = req.body
      const hashedPassword = await hashPassword(password)

      const user = await ModuleUser.create({
        name,
        email,
        password : hashedPassword,
        pais,
      })
      res.status(201).json({
        status: 'true',
        msg: 'User cadastrado com sucesso',
        data: {}
      })
    } catch (error) {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro',
      })
    }
  },

  login: async (req, res) => {
    const secret_key =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    //Receber qualquer erro de validação
    const errors = validationResult(req)

    //Verificar se existe algum erro de validação se houver retornar
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => ({
          type: err.type,
          msg: err.msg,
          campo: err.path,
          valor: err.value
        }))
      })
    }

    try {
      const { email, password } = req.body
      const user = await ModuleUser.findOne({ where: { email } })
      if (!user)
        return res
          .status(401)
          .json({ status: 'false', msg: 'Email ou senha inválida' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return res
          .status(401)
          .json({ status: 'false', msg: 'Email ou senha inválida' })
      const token = jwt.sign({ id: user.id }, secret_key, { expiresIn: '3d' })
      const verified = jwt.verify(token, secret_key)
      req.userId = verified.id

      return res
        .status(200)
        .json({ status: 'true', msg: 'Login bem sucedido', token })
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        msg: 'Erro no servidor!'
      })
    }
  },

  logout: async (req, res) => {
    try {
      const invalidTokens = new Set()
      const token = req.header('Authorization').replace('Bearer ', '')
      invalidTokens.add(token)
      res
        .status(200)
        .json({ status: 'true', msg: 'Logout realizado com sucesso' })
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        msg: 'Erro no servidor!'
      })
    }
  }
}
