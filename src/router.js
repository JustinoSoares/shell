const express = require('express')
const router = express.Router()
const users = require('./models/users')
const exercices = require('./models/exercice')
const relationship = require('./models/relationship')
const user_ex = require('./models/user_has_ex')
const user_controller = require('./controllers/user')
const { body, validationResult } = require('express-validator')
const validatorUser = require('./validator/user')
const validate_exec = require('./controllers/validate')
const exec = require('./controllers/exec')
const multer = require('multer')
const path = require('path')
const auth = require('./middleware/auth')

router.get('/', (req, res) => {
  res.json({
    msg: 'Seja bem vindo ao shell'
  })
})

router.post('/create_user', user_controller.create)
router.post('/login', user_controller.login)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/') // Pasta onde os arquivos serão armazenados
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
router.get('/each_user/:userId', user_controller.each_user);
router.get('/each_ex/:exId', exec.each_ex)
router.get('/show_ex', auth.authenticateToken, exec.show_ex)
router.post('/create_ex', 
  //auth.authenticateTokenAdmin,
   upload.single('tester'), exec.create_ex)
router.post('/validate/:exId', auth.authenticateToken, validate_exec.validate)

module.exports = router
