'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const Dish = require('../models/dish');

router.get('/',authenticationEnsurer, (req, res, next) => {
  res.render('selectGenre', {
    user: req.user
  });
});

router.post('/',authenticationEnsurer, (req, res, next) => {
  if(parseInt(req.query.japan) === 1){
    mainMap(req, res, '和食', '主菜');
  }
});

function mainMap(req, res, genre, role){
  Dish.findAll({
    where: {
      dishGenre: genre,
      createdBy: req.user.userId,
      dishRole: role
    }
  }).then((dish) => {
    console.log(dish);
    res.redirect('/');
  });
}

module.exports = router;