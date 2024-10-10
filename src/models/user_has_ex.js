const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = require("./users");
const Ex = require("./exercice");

const user_ex = sequelize.define("user_exes", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull: false,
    },
    feito : {
        type: Sequelize.BOOLEAN,
        defaultValue : 0,
    },
    exId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
            model : Ex,
            key : 'id',  
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey : true,
    },
    userId : {
        type : Sequelize.INTEGER,
        allowNull : false,
        Reference : {
            model : User,
            key : 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
    },
})
//user_ex.sync({ alter : true});
module.exports = user_ex;