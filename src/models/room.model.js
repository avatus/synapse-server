const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, },
    last_message_received: { type: Date, default: Date.now },
    users: { type: Number, default: 0},
    history: [{
        id: String,
        user: String,
        text: String,
        type: { type: String, default: "text" },
        delivered: { type: Boolean, default: true},
        time: Date
    }]
}, { minimize: false })


const Room = mongoose.model('Room', roomSchema)

module.exports = Room