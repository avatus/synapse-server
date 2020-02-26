const axios = require('axios')
const signJwt = require('../utils/signJwt')

exports.recaptcha = async (req, res) => {
    try {
        const key = req.body.key
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${key}`
        axios.post(url)
        .then(response => {
            if (response.data.success === true) {
                return res.status(200).json({
                    success: true, 
                    token: signJwt() 
                })
            }
        })
        .catch(error => {
            console.log(error)
            return res.status(401).json({message: 'invalid recaptcha token'})
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

exports.verifyJwt = async (req, res) => {
    if (req.user === true) {
        return res.status(200).json({message: "Humanity confirmed"})
    }
    return res.status(401).json({message: "You are not human."})
}