require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const expressValidator = require("express-validator");
const port = process.env.PORT || 3000
const { exec } = require('child_process');

const fs = require('fs');
const path = require('path');

// Caminho absoluto para o script
const scriptPath = path.resolve(__dirname, './script.sh');
const testerPath = path.resolve(__dirname, '../upload/*.sh');

// Tornar o arquivo executável
fs.chmod(scriptPath, '755', (err) => {
  if (err) throw err;
  console.log('Arquivo agora é executável.');
});

exec(testerPath, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", router);

module.exports = app
/*app.listen(port, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});*/