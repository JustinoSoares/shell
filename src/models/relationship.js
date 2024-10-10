const User = require("./users");
const User_ex = require("./user_has_ex");
const Ex = require("./exercice");

//Notification_User
User.belongsToMany(Ex, { through: 'user_exes', foreignKey : "userId" });
Ex.belongsToMany(User, { through: 'user_exes', foreignKey : "exId" });

module.exports = {User, Ex};




