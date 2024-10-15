if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config({ path: './.env' });
}
  
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const expressValidator = require("express-validator");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/", router);

module.exports = app
/*app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});*/