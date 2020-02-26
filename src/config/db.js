const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

mongoose.connection
    .once('open', () => {
        console.log(`Database ${chalk.green('connected ✓')}`)
    })

const db = {
    init: () => {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    }
}

module.exports = db