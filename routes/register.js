'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const flash = require('express-flash-messages');

router.use(flash());

router.get('/', (req, res, next) => {
  res.render('register')
});

router.post('/', (req, res, next) => {
  const passwordCheck = req.body.password.length > 0
  const usernameCheck = req.body.username.length > 0
  if (!passwordCheck) {
    req.flash('error', 'パスワードを入力してください！');
    return res.redirect('/register');
  }
  if (!usernameCheck) {
    req.flash('error', 'ユーザーネームを入力してください！');
    return res.redirect('/register')
  }
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(() => {
    res.redirect('/');
  }).catch(() => {
    req.flash('error', 'そのusernameはすでに使われています!');
    return res.redirect('/register');
  });
});

module.exports = router;