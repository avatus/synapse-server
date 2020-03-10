const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recentMessageSchema = new Schema({
    room: { type: String },
    message: {}
}, { minimize: false, capped: {max: 50, size: 3000000} })


const RecentMessage = mongoose.model('RecentMessage', recentMessageSchema)

module.exports = RecentMessage