const sequelize = require('../db')
const { Sequelize } = require('sequelize')
const Ex = require('./exercice')
const User = require('./users')


const ExActivity = sequelize.define('ExerciseActivity', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    date: {
        type: Sequelize.DATEONLY,  // Apenas a data, sem a hora
        allowNull: false,
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});
ExActivity.belongsTo(User, { foreignKey: 'userId' });
ExActivity.sync();
module.exports = ExActivity;