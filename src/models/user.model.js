const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    id_token: { type: String, required: true, trim: true, unique: true, },
    socket: { type: String, require: true, trim: true },
    rooms: [{ type: String, default: []}],
    unread: {},
}, { minimize: false })


const User = mongoose.model('User', userSchema)

module.exports = User