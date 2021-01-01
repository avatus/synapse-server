require('dotenv').config()
const chalk = require('chalk')

const http = require('./src/app').http

const port = process.env.PORT || 5001

http.listen(port, () => {
    console.log(`Server ${chalk.green('connected')}: ${chalk.magenta(new Date().toISOString())}`)
    console.log(`Port ${chalk.green(port)}`)
})