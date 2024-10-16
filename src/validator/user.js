const { body, validationResult } = require('express-validator');
const ModuleUser = require("../models/users");

const userCreate = [
  body("name").trim().escape()
    .notEmpty()
    .withMessage("O primeiro nome deve ser preenchido!")
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres')
    .bail(), // para de validar se encontrar um erro, isso evita validacoes desnecessárias

  body("email").isEmail().withMessage("Email Inválido.")
    .custom(async (email) => {
      const user = await ModuleUser.findOne({ where: { email } });
      if (user)
        throw new Error('Este email já está associado a uma conta!');
    }),

  body("password").trim().escape()
    .notEmpty()
    .withMessage("O campo Senha seve ser preenchido!")
    .isLength({ min: 6 })
    .withMessage("A password deve ter no mínimo 6 caracters."),
];

const userUpdate = [
  body("name").trim().escape()
    .notEmpty()
    .withMessage("O primeiro nome deve ser preenchido!")
    .bail(), // para de validar se encontrar um erro, isso evita validacoes desnecessárias

  body("email").isEmail().withMessage("Email Inválido."),
  body("password").trim().escape()
    .notEmpty()
    .withMessage("O campo Senha seve ser preenchido!")
    .isLength({ min: 6 })
    .withMessage("A password deve ter no mínimo 6 caracters."),

  body("date_born")
    .notEmpty().withMessage('A data é obrigatória.')
    .isDate().withMessage('Data inválida. Formato esperado: YYYY-MM-DD.')
];

const userLogin = [
  body("email").trim().escape()
    .notEmpty()
    .withMessage("Campo email obrigatório!")
    .bail(),

  body("password").trim().escape()
    .notEmpty()
    .withMessage("Campo Senha obrigatório!")
    .bail(),
];

module.exports = { userCreate, userUpdate, userLogin };