'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const uuid = require('uuid');
const Dish = require('../models/dish');
const updatedAt = new Date();

router.get('/', (req, res, next) => {
  if (req.user) {
    Dish.findAll({
      where: { createdBy: req.user.userId },
      order: [['"updatedAt"', 'DESC']]
    }).then((dishes) => {
      res.render('menu', {
        user: req.user,
        dishes
      });
    });
  }
});

router.get('/new',authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  console.log(req.user);
  
  const dishId = uuid.v4();
  Dish.create({
    dishId: dishId,
    dishName: req.body.dishName,
    dishUrl: req.body.dishUrl || '(未設定)',
    dishGenre: req.body.genre,
    dishRole: req.body.role,
    createdBy: req.user.userId,
    updatedAt
  }).then(() => {
    res.redirect('/menu');
  });
});

module.exports = router;