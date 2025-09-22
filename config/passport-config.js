const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserRepository = require('../repositories/userRepository');
const { ObjectId } = require('mongodb');

const userModel = new UserModel();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const collection = await userModel.connect();
                const user = await collection.findOne({ _id: new ObjectId(jwt_payload.id) });

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