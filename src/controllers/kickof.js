require("dotenv").config()
const bcrypt = require('bcrypt');
const  User  = require('../models/users'); // ajuste conforme a sua estrutura de modelos

async function createAdmin() {
  const username = "JavaScript"
  const email = 'javascript225566@gmail.com'; // email do admin
  const password = process.env.PASSADM; // senha do admin

  // Verifica se já existe um usuário administrador
  const existingAdmin = await User.findOne({ where: { email } });
  if (existingAdmin) {
    console.log('Usuário administrador já existe.');
    return;
  }

  // Cria um novo usuário administrador
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name: username,
    email,
    password: hashedPassword,
    permission: 'admin',
    pais: 'Angola'
  });

  console.log('Usuário administrador criado com sucesso.');
}

// Chama a função de criação do admin
createAdmin().catch(console.error);