require('dotenv').config({ path: '../env' })
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: 'mysql'
  }
);

(async () => {
  try {
    await sequelize.sync()
    console.log('All right...')
  } catch (error) {
    console.log('All Wrong..')
  }
})()

module.exports = sequelize
