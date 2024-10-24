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

const exCreate = [
  body("name").trim().escape()
    .notEmpty()
    .withMessage("O name deve ser preenchido!")
    .isLength({ min: 3 })
    .withMessage('O nome deve ter no mínimo 3 caracteres')
    .bail(), // para de validar se encontrar um erro, isso evita validacoes desnecessárias

  body("subject").trim().escape()
    .notEmpty()
    .withMessage("O subject deve ser preenchido!")
    .isLength({ min: 3 })
    .withMessage('O subject deve ter no mínimo 3 caracteres')
    .bail(),
  body("categoria").trim().escape()
    .notEmpty()
    .withMessage("O categoria deve ser preenchido!")
    .isLength({ min: 3 })
    .withMessage('O categoria deve ter no mínimo 3 caracteres')
    .bail(),
  body("nivel").trim().escape()
    .notEmpty()
    .withMessage("O nivel deve ser preenchido!")
    .bail(),
  body("tester").custom((value, { req }) => {
    if (!value) {
      return req.message("O tester deve ser preenchido!");
    }
    if (!value.endsWith(".sh")) {
      return req.message("O tester deve ser um arquivo .sh!");
    }
    return true;
  }),
];
module.exports = { userCreate, userUpdate, userLogin, exCreate };