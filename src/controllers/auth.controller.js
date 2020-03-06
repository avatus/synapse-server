const User = require('../models/user.model')
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

exports.getUser = async (req, res) => {
    const id_token = req.id_token
    try {
        const user = await User.findOne({id_token})
        if (user === null) {
            return res.status(404).json({message: 'Could not authenticate user.'})
        }
        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Could not authenticate user.'})
    }
}

exports.updateSettings = async (req, res) => {
    const id_token = req.id_token
    try {
        let user = await User.findOne({id_token})
        if (user === null) {
            return res.status(404).json({message: `Error while trying to update ${req.body.setting}`})
        }
        user.settings[req.body.setting] = req.body.update
        user.save()
        return res.status(200).json({message: 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Could not update settings."})
    }
}