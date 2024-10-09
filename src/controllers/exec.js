const ModuleUser = require('../models/users')
const bcrypt = require('bcrypt')
const express = require('express')
const { body, validationResult } = require('express-validator')
const Exercice = require('../models/exercice')
const { Sequelize, Op, where } = require('sequelize')
module.exports = {
  each_ex: async (req, res) => {
    try {
      const ex = await Exercice.findByPk(req.params.exId)
      if (!ex) {
        return res.status(404).json({
          status: 'false',
          msg: 'Exercício não encontrado'
        })
      }
      res.status(201).json({
        status: 'true',
        msg: 'Exercício encontrado com sucesso',
        data: ex
      })
    } catch {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro'
      })
    }
  },

  show_ex: async (req, res) => {
    const {categoria} = req.query;
    const cat = categoria ? categoria : null;
    try {
      const ex = await Exercice.findAll({
        where : {
          categoria: cat,
        }
      })
      if (!ex.length) {
        return res.status(404).json({
          status: 'false',
          msg: 'Nem um Exercício encontrado'
        })
      }
      res.status(201).json({
        status: 'true',
        msg: 'Encontrado com sucesso',
        data: ex
      })
    } catch (error){
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro',
      })
    }
  },
  create_ex: async (req, res) => {
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
      const { name, subject, nivel, categoria } = req.body

      const ex = await Exercice.create({
        name,
        subject,
        nivel,
        categoria,
        tester: req.file.path
      })
      res.status(201).json({
        status: 'true',
        msg: 'Exercice cadastrado com sucesso',
        data: ex
      })
    } catch (error) {
      return res.status(500).json({
        status: 'false',
        msg: 'Ocorreu um erro',
        mm: error
      })
    }
  },

  delete_ex : async (req, res) => {
    try {
      const ex  = await Exercice.findByPk(req.params.exId);
      if (!ex)
      {
        return res.status(404).json({
          status : "false",
          msg: "Não foi encontrado esse exercício"
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
  }
}
