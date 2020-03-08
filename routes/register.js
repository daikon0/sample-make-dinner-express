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
  if (!passwordCheck) {
    console.log('通ってる');
    req.flash('error', 'パスワードを入力してください！');
    return res.redirect('/register');
  }
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(() => {
    res.redirect('/');
  });
});

module.exports = router;