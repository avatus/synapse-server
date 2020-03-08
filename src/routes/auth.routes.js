const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = passport.authenticate('jwt', { session: false })
const Controller = require('../controllers/auth.controller')

router.post('/recaptcha', Controller.recaptcha)
router.get('/verify', jwt, Controller.verifyJwt)
router.post('/user_image_upload', jwt, Controller.getCloudinarySignature)

module.exports = router