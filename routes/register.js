'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('register')
});

router.post('/', (req, res, next) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(() => {
    res.redirect('/');
  });
});

module.exports = router;