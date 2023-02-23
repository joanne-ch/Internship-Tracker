const express = require('express')
const router = express.Router()

const AuthController = require('../controller/AuthController')

router.post('/register', AuthController.register)
router.get('/verify/:token', AuthController.verify )

module.exports = router