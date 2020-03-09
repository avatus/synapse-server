const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = passport.authenticate('jwt', { session: false })
const Controller = require('../controllers/message.controller')

router.post('/report_message', jwt, Controller.reportMessage)

module.exports = router