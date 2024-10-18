require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const mailjet = require('node-mailjet');

// Função para enviar email de recuperação
async function sendResetPasswordEmail(userEmail) {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    // Gerar token de redefinição de senha
    const resetToken = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({ id: user._id, resetToken }, process.env.SECRET_KEY_JWT, { expiresIn: '1h' });

    // URL de recuperação de senha (substitua pela URL da sua aplicação)
    const resetUrl = `shell-git-master-justino-soares-projects.vercel.app/api/reset_password/${token}`;

    // Enviar email com Mailjet
    const mailjetClient = mailjet.apiConnect(process.env.API_KEY_MAILJET, process.env.SECRET_KEY_MAILJET);
    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'justinocsoares123@gmail.com',
                    Name: 'Shelling',
                },
                To: [
                    {
                        Email: user.email,
                        Name: user.name,
                    },
                ],
                Subject: 'Recuperação de Senha',
                TextPart: `Olá, use o link abaixo para redefinir sua senha: ${resetUrl}`,
                HTMLPart: `<p>Olá,</p><p>Use o link abaixo para redefinir sua senha:</p><a href="${resetUrl}">Redefinir Senha</a>`,
            },
        ],
    });
    await request;
    return { msg: 'Email de recuperação enviado com sucesso!' };
}

module.exports = {
    reset_password: async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;

        try {
            // Verificar e decodificar o token
            const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(400).json({
                    status: "false",
                    msg: 'Token inválido ou expirado'
                });
            }
            // Criptografar a nova senha
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({
                status: 'true',
                msg: 'Senha redefinida com sucesso!'
            });
        } catch (error) {
            res.status(500).json({
                status: 'false',
                msg: 'Token inválido ou expirado'
            });
        }
    },
    forgot_password: async (req, res) => {
        const { email } = req.body;

        try {
            await sendResetPasswordEmail(email);
            res.status(200).json({ status: 'true', msg: 'Email de recuperação enviado!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}