const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    id_token: { type: String, required: true, trim: true, unique: true, },
    socket: { type: String, require: true, trim: true },
}, { minimize: false })


const User = mongoose.model('User', userSchema)

module.exports = User