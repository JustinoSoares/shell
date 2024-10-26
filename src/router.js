const express = require('express')
const router = express.Router()
const users = require('./models/users')
const exercices = require('./models/exercice')
const relationship = require('./models/relationship')
const user_ex = require('./models/user_has_ex')
const Ex_activity = require('./models/activity')
const user_controller = require('./controllers/user')
const { body, validationResult } = require('express-validator')
const validatorUser = require('./validator/user')
const validate_exec = require('./controllers/validate')
const exec = require('./controllers/exec')
const multer = require('multer')
const path = require('path')
const auth = require('./middleware/auth')
const kickof = require("./controllers/kickof");
const reset_password = require('./controllers/reset_password')


router.get('/', (req, res) => {
  res.json({
    msg: 'Seja bem vindo ao shell'
  })
})

// Users
router.post('/create_user', validatorUser.userCreate, user_controller.create);
router.post('/login', user_controller.login);
router.get('/show_users', user_controller.show_users);
router.get('/each_user/:userId', user_controller.each_user);
router.put('/update_user/', auth.authenticateToken, user_controller.update_user);
router.post('/forgot_password', reset_password.forgot_password);
router.post('/reset_password/:token', reset_password.reset_password);
const path = '/tmp/upload/';

// Verifica se a pasta existe, se não, cria a pasta
if (!fs.existsSync(path)){
    fs.mkdirSync(path, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path) // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /sh/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Arquivo inválido!'))
    }
  }
})


//Exercices
router.get('/each_ex/:exId', auth.authenticateToken, exec.each_ex)
router.get('/show_ex', auth.authenticateToken, exec.show_ex)
router.post(
  '/create_ex',
  upload.single('tester'),
  auth.authenticateTokenAdmin,
  exec.create_ex
)
router.post('/validate/:exId', auth.authenticateToken, validate_exec.validate)
module.exports = router
