module.exports = io => {
    const express = require('express')
    const router = express.Router()
    const passport = require('../config/passport')
    // const jwt = passport.authenticate('jwt', { session: false })
    const Controller = require('../controllers/socket.controller')

    router.get('/getAllRooms', Controller.getAllRooms(io))

    return router
}