const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const initialize = async (passport, getUser, getUserById) => {
    const verify = async (username, password, done) => {
        const user = await getUser(username);

        if (user == null) {
            return done(null, false, { message: 'No user with that username.' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'incorrect password.' });
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new localStrategy(verify));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;