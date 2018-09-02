const local = require('./localStrategy');
const kakako = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.find({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as : 'Followings'
            }]
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local(passport);
    kakako(passport);
    naver(passport);
}