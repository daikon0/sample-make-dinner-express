'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const uuid = require('uuid');

router.get('/', (req, res, next) => {
  res.render('menu', { user: req.user });
});

router.get('/new', (req, res, next) => {
  res.render('new', { user: req.user });
});

module.exports = router;