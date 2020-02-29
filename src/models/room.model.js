const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, },
    last_message_received: { type: Date, default: Date.now },
    history: []
}, { minimize: false })


const Room = mongoose.model('Room', roomSchema)

module.exports = Room