const JWT = require('jsonwebtoken')
const uuid = require('uuid/v4')

const signToken = () => {
    return JWT.sign({
        iss: 'synaptics.dev',
        sub: uuid(),
        iat: Math.floor(Date.now() / 1000),
    }, process.env.PASSPORT_SECRET, { expiresIn: '7d' })
}

module.exports = signToken