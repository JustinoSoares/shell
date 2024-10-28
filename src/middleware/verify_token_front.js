// middleware/auth.js
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY_JWT; // Use uma chave secreta forte

const verifyToken = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      status: "false",
      msg: "Token não fornecido.",
    });
  }

  // Verifica e decodifica o token
  const verified = jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Personalizar a mensagem de erro
      return res.status(401).json({
        status: "false",
        msg: "Token inválido. Por favor, forneça um token válido.",
      });
    }
    return res.json({
      status: "true",
      msg: "Token válido",
      data: {
        id: decoded.id,
        permission: decoded.permission,
      },
    });
  });
};

module.exports = { verifyToken };
