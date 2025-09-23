const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserRepository = require('../repositories/userRepository');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await UserRepository.findById(jwt_payload.id);

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        })
    );
};