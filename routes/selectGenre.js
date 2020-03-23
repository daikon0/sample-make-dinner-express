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

    Dish.findAll({
      where: {
        dishGenre: '和食',
        createdBy: req.user.userId,
        dishRole: '主菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //和食||主菜をmaindishに入れる
      const maindish = dishArray[Math.floor(Math.random()*dishArray.length)];
      

      Dish.findAll({
        where: {
          dishGenre: '和食',
          createdBy: req.user.userId,
          dishRole: '副菜'
        }
      }).then((dish) => {
        const dishArray = [];
        dish.forEach((dish) => {
          dishArray.push(dish);
        });
        //和食||副菜をsubdishに入れる
        const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

        Dish.findAll({
          where: {
            dishGenre: '和食',
            createdBy: req.user.userId,
            dishRole: '汁物'
          }
        }).then((dish) => {
          const dishArray = [];
          dish.forEach((dish) => {
            dishArray.push(dish);
          });
          //和食||汁物をsoupに入れる
          const soup = dishArray[Math.floor(Math.random()*dishArray.length)];
        
        res.render('result', {
          maindish: maindish,
          subdish: subdish,
          soup: soup
        });
      });
    }); 
  })
  }
});

module.exports = router;