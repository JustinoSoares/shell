require('dotenv').config()
const { Sequelize } = require('sequelize')
const mysql2 = require('mysql2')

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    pool: {
      max: 5,   // número máximo de conexões simultâneas
      min: 0,
      acquire: 30000,  // tempo máximo, em milissegundos, que o pool tentará obter uma conexão antes de lançar um erro
      idle: 10000   // tempo máximo, em milissegundos, que uma conexão pode ficar inativa antes de ser liberada
    }
  }
);

//const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:');

(async () => {
  try {
    await sequelize.sync()
    console.log('All right...')
  } catch (error) {
    console.log('All Wrong..')
  }
})()

module.exports = sequelize
