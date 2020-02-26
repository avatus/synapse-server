const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = passport.authenticate('jwt', { session: false })
const Controller = require('../controllers/auth.controller')

router.post('/recaptcha', Controller.recaptcha)
router.get('/verify', jwt, Controller.verifyJwt)

module.exports = router