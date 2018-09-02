const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User, Follow } = require('../models');

const router = express.Router();

router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const exNick = await User.find({ where: { nick: req.body.nick } });
        if (exNick && (exNick.id != req.user.id)) {
            req.flash('updateError', '이미 사용 중인 닉네임입니다.');
            return res.redirect('/profile');
        }
        await User.update({
            nick: req.body.nick
        }, {
            where: {
                id: req.user.id
            }
        })
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.find({ where: { id: req.user.id } });
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        await Follow.destroy({
            where: {
                followerId: req.user.id,
                followingId: req.params.id
            }
        });
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;