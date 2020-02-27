const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, },
}, { minimize: false })


const Room = mongoose.model('Room', roomSchema)

module.exports = Room