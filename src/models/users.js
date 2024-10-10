const { Sequelize } = require("sequelize");
const sequelize = require("../db");



const User = sequelize.define("users",{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        timestamps: true
    },
    sex: {
        type: Sequelize.ENUM("M", "F"),
        allowNull: true,
    },
    verify: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    permission: {
        type : Sequelize.ENUM("admin", "normal"),
        defaultValue : "normal"
    },
    pontos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue : 0,
    },
    resolvidos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue : 0,
    },
    pais: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
User.sync({ alter : true });
module.exports = User;