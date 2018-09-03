const express = require('express');
const moment = require('moment');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {
    title: '내 정보 - NodeBird',
    user: req.user,
    updateError: req.flash('updateError')
  });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick']
    },
    order: [['createdAt', 'DESC']]
  })
  .then((posts) => {
    for (post in posts) {
      posts[post].date = moment(posts[post].dataValues.createdAt).format('YYYY년MM월DD일 HH시mm분');
    }
    console.log("posts객체:", posts);
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
      user: req.user,
      loginError: req.flash('loginError')
    });
  })
  .catch((error) => {
    console.error(error);
    next(error);
  });
});

module.exports = router;