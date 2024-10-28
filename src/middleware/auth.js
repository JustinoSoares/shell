require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Middleware para verificar e decodificar o token JWT
const authenticateToken = (req, res, next) => {
  const secret_key = process.env.SECRET_KEY_JWT;

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "false",
      msg: "Acesso negado, Sem permissão!",
    });
  }

  try {
    // Verifica e decodifica o token
    const verified = jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        // Personalizar a mensagem de erro
        return res.status(401).json({
          status: "false",
          msg: "Token inválido. Por favor, forneça um token válido.",
        });
      }
      next();
    });

    // Define o ID do usuário no req para ser usado nas rotas
    req.userId = verified.id;

    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      msg: "Token inválido",
    });
  }
};

const authenticateTokenAdmin = async (req, res, next) => {
  try {
    const secret_key = process.env.SECRET_KEY_JWT;

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "false",
        msg: "Acesso negado, token não fornecido",
      });
    }

    // Verifica e decodifica o token
    const verified = jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        // Personalizar a mensagem de erro
        return res.status(401).json({
          status: "false",
          msg: "Token inválido. Por favor, forneça um token válido.",
        });
      }
      next();
    });
    const user = await User.findByPk(verified.id);
    if (user.permission !== "admin") {
      return res.status(401).json({
        status: false,
        msg: "Token inválido",
      });
    }
    // Define o ID do usuário no req para ser usado nas rotas
    req.userId = verified.id;

    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      msg: "Token inválido",
    });
  }
};

module.exports = { authenticateToken, authenticateTokenAdmin };
