module.exports = io => {
    const express = require('express')
    const router = express.Router()
    const passport = require('../config/passport')
    // const jwt = passport.authenticate('jwt', { session: false })
    const Controller = require('../controllers/socket.controller')

    router.get('/get_all_rooms', Controller.getAllRooms(io))
    router.get('/get_room_info/:room', Controller.getRoomInfo(io))

    return router
}