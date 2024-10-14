const { Sequelize } = require('sequelize')
const sequelize = require('../db')

const Exercice = sequelize.define('exercices', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  subject: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  nivel: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  categoria: {
    type: Sequelize.ENUM(
      'Coelho',
      'Gato',
      'Raposa',
      'Lobo',
      'Águia',
      'Leopardo',
      'Tigre',
      'Leão',
      'Elefante',
      'Dragão'
    ),
    allowNull: false
  },
  tester: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 0
  },
  resolvidos: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
})
Exercice.sync({ alter : true });
module.exports = Exercice
