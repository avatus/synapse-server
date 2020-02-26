const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.PASSPORT_SECRET
}, async (payload, done) => {
    try {
        done(null, true);
    } catch (error) {
        done(error, false);
    }
}));

module.exports = passport