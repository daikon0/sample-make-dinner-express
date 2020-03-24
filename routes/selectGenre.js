'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const Dish = require('../models/dish');
const flash = require('express-flash-messages');

router.use(flash());

router.get('/',authenticationEnsurer, (req, res, next) => {
  res.render('selectGenre', {
    user: req.user
  });
});

router.post('/',authenticationEnsurer, (req, res, next) => {
  //和食のとき
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
      const maindish = dishArray[Math.floor(Math.random() * dishArray.length)];
      

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
        
          if (maindish === undefined || subdish === undefined || soup === undefined){
            req.flash('error', '料理をもっと作ってください！！');
            res.redirect('/selectGenre');
          } else {
          res.render('result', {
            maindish: maindish,
            subdish: subdish,
            soup: soup
          });
        }
        res.render('result', {
          maindish: maindish,
          subdish: subdish,
          soup: soup
        });
      });
    }); 
  })
  }
  
  //洋食のとき
  else if(parseInt(req.query.western) === 1){

    Dish.findAll({
      where: {
        dishGenre: '洋食',
        createdBy: req.user.userId,
        dishRole: '主菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //洋食||主菜をmaindishに入れる
      const maindish = dishArray[Math.floor(Math.random()*dishArray.length)];
      

      Dish.findAll({
        where: {
          dishGenre: '洋食',
          createdBy: req.user.userId,
          dishRole: '副菜'
        }
      }).then((dish) => {
        const dishArray = [];
        dish.forEach((dish) => {
          dishArray.push(dish);
        });
        //洋食||副菜をsubdishに入れる
        const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

        Dish.findAll({
          where: {
            dishGenre: '洋食',
            createdBy: req.user.userId,
            dishRole: '汁物'
          }
        }).then((dish) => {
          const dishArray = [];
          dish.forEach((dish) => {
            dishArray.push(dish);
          });
          //洋食||汁物をsoupに入れる
          const soup = dishArray[Math.floor(Math.random()*dishArray.length)];
          
        if (maindish === undefined || subdish === undefined || soup === undefined){
          req.flash('error', '料理をもっと作ってください！！');
          res.redirect('/selectGenre');
        } else {
        res.render('result', {
          maindish: maindish,
          subdish: subdish,
          soup: soup
        });
      }
      });
    }); 
  })
  }

  //中華のとき
  else if(parseInt(req.query.china) === 1){

    Dish.findAll({
      where: {
        dishGenre: '中華',
        createdBy: req.user.userId,
        dishRole: '主菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //中華||主菜をmaindishに入れる
      const maindish = dishArray[Math.floor(Math.random()*dishArray.length)];
      

      Dish.findAll({
        where: {
          dishGenre: '中華',
          createdBy: req.user.userId,
          dishRole: '副菜'
        }
      }).then((dish) => {
        const dishArray = [];
        dish.forEach((dish) => {
          dishArray.push(dish);
        });
        //中華||副菜をsubdishに入れる
        const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

        Dish.findAll({
          where: {
            dishGenre: '中華',
            createdBy: req.user.userId,
            dishRole: '汁物'
          }
        }).then((dish) => {
          const dishArray = [];
          dish.forEach((dish) => {
            dishArray.push(dish);
          });
          //中華||汁物をsoupに入れる
          const soup = dishArray[Math.floor(Math.random()*dishArray.length)];
        
          if (maindish === undefined || subdish === undefined || soup === undefined){
            req.flash('error', '料理をもっと作ってください！！');
            res.redirect('/selectGenre');
          } else {
          res.render('result', {
            maindish: maindish,
            subdish: subdish,
            soup: soup
          });
        }
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