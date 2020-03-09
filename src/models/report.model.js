const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = new Schema({
    info: { type: String, trim: true},
    date_created: { type: Date, default: Date.now },
    message: {}
}, { minimize: false })


const Report = mongoose.model('Report', reportSchema)

module.exports = Report