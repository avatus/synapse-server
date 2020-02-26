module.exports = (req, res, next) => {
    const id_token = req.headers['x-id-token']
    if (!id_token) {
        return next("no token", null)
    }
    req.id_token = id_token
    return next()
}