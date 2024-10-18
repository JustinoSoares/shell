const ModuleUser = require('../models/users')
const bcrypt = require('bcrypt')
const express = require('express')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Ex = require('../models/exercice')
const axios = require('axios')

module.exports = {
  // cada usuário
  each_user: async (req, res) => {
    const user = await User.findByPk(req.params.userId, {
      include: {
        model: Ex,
        through: {
          attributes: ['feito'] // Incluir o campo 'feito' da tabela intermediária
        }
      }
    })
    async function getCountryData(countryName) {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${countryName}`
        )
        // Retorna o nome oficial do país
        return [response.data[0].flag, response.data[0].name.common]
      } catch (error) {
        console.error(`Erro ao buscar o país ${countryName}:`, error)
        return 'País não encontrado'
      }
    }
    if (!user) {
      return res.status('404').json({
        status: 'false',
        msg: 'Não encontrado'
      })
    }
    const {
      id,
      name,
      email,
      pontos,
      resolvidos,
      pais,
      createdAt,
      updatedAt,
      exercices
    } = user
    const data = {
      id,
      name,
      email,
      pontos,
      resolvidos,
      country: await getCountryData(pais),
      createdAt,
      updatedAt,
      exercices
    }
    return res.status(200).json({
      status: 'true',
      msg: 'User encontrado',
      data: data
    })
  },

  show_users: async (req, res) => {
    const { order_by, asc_desc, limitMax } = req.query
    const whereLimitMax = limitMax ? limitMax : '3'
    const whereOrderBy = order_by ? order_by : 'createdAt'
    const whereAsc = asc_desc ? asc_desc : 'desc'
    try {
      const users = await User.findAll({
        order: [[whereOrderBy, whereAsc]],
        limit: parseInt(whereLimitMax)
      })
      if (!users.length) {
        return res.status(404).json({
          status: 'false',
          msg: 'Nem um Usuário encontrado'
        })
      }

      async function getCountryData(countryName) {
        try {
          const response = await axios.get(
            `https://restcountries.com/v3.1/name/${countryName}`
          )
          // Retorna o nome oficial do país
          return [response.data[0].flag, response.data[0].name.common]
        } catch (error) {
          console.error(`Erro ao buscar o país ${countryName}:`, error)
          return 'País não encontrado'
        }
      }
      async function mapUsersWithCountry() {
        const resultado = await Promise.all(
          users.map(async (user, index) => ({
            id: user.id,
            index: index + 1,
            name: user.name,
            email: user.email,
            resultado: user.resolvidos,
            pontos: users.pontos,
            pais: await getCountryData(user.pais)
          }))
        )
        res.status(201).json({
          status: 'true',
          msg: 'Encontrado com sucesso',
          data: resultado
        })
      }
      mapUsersWithCountry()
    } catch (error) {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro'
      })
    }
  },

  // criar users
  create: async (req, res) => {
    // function cryptografia
    async function hashPassword(password) {
      const saltsRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltsRounds)
      return hashedPassword
    }

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
      const { name, email, password, pais } = req.body
      const hashedPassword = await hashPassword(password)

      const user = await ModuleUser.create({
        name,
        email,
        password: hashedPassword,
        pais
      })
      res.status(201).json({
        status: 'true',
        msg: 'User cadastrado com sucesso',
        data: {}
      })
    } catch (error) {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro'
      })
    }
  },

  update_user: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, email, pais, password, newPassword } = req.body
      const user = await ModuleUser.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: 'false',
          msg: 'Usuário não encontrado'
        })
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (pais) user.pais = pais;
      // Se a senha atual foi fornecida, faça a verificação e atualização da nova senha
      if (password && newPassword) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ status: "false", msg: 'A palavra chave actual está incorreta' });
        }
        // Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
      await user.save();
      return res.status(200).json({
        status: 'true',
        msg: 'Dados atualizados com sucesso',
        user
      });
    } catch (error) {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro'
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
        .json({ status: 'true', msg: 'Login bem sucedido', token, userId: req.userId, username: user.name })
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
