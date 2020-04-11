'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const flash = require('express-flash-messages');
const db =require('../models/index');

router.use(flash());

router.get('/',authenticationEnsurer, (req, res, next) => {
  res.render('selectGenre', {
    user: req.user
  });
});

router.get('/japan', authenticationEnsurer, (req, res, next) => {
  debug.dish.findAll({
    where: {
      dishGenre: '和食',
      createdBy: req.user.id,
      dishRole: '主菜'
    }
  }).then((dish) => {
    const dishArray = [];
    dish.forEach((dish) => {
      dishArray.push(dish);
    });
    //和食||主菜をmaindishに入れる
    const maindish = dishArray[Math.floor(Math.random() * dishArray.length)];
    

    db.dish.findAll({
      where: {
        dishGenre: '和食',
        createdBy: req.user.id,
        dishRole: '副菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //和食||副菜をsubdishに入れる
      const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

      db.dish.findAll({
        where: {
          dishGenre: '和食',
          createdBy: req.user.id,
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
            user: req.user,
            maindish: maindish,
            subdish: subdish,
            soup: soup
      });
    }
    });
  });
});
});

router.get('/western', authenticationEnsurer, (req, res, next) => {
  db.dish.findAll({
    where: {
      dishGenre: '洋食',
      createdBy: req.user.id,
      dishRole: '主菜'
    }
  }).then((dish) => {
    const dishArray = [];
    dish.forEach((dish) => {
      dishArray.push(dish);
    });
    //洋食||主菜をmaindishに入れる
    const maindish = dishArray[Math.floor(Math.random()*dishArray.length)];
    

    db.dish.findAll({
      where: {
        dishGenre: '洋食',
        createdBy: req.user.id,
        dishRole: '副菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //洋食||副菜をsubdishに入れる
      const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

      db.dish.findAll({
        where: {
          dishGenre: '洋食',
          createdBy: req.user.id,
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
        user: req.user,
        maindish: maindish,
        subdish: subdish,
        soup: soup
      });
    }
    });
  }); 
});
});

router.get('/china', authenticationEnsurer, (req, res, next) => {
  db.dish.findAll({
    where: {
      dishGenre: '中華',
      createdBy: req.user.id,
      dishRole: '主菜'
    }
  }).then((dish) => {
    const dishArray = [];
    dish.forEach((dish) => {
      dishArray.push(dish);
    });
    //中華||主菜をmaindishに入れる
    const maindish = dishArray[Math.floor(Math.random()*dishArray.length)];
    

    db.dish.findAll({
      where: {
        dishGenre: '中華',
        createdBy: req.user.id,
        dishRole: '副菜'
      }
    }).then((dish) => {
      const dishArray = [];
      dish.forEach((dish) => {
        dishArray.push(dish);
      });
      //中華||副菜をsubdishに入れる
      const subdish = dishArray[Math.floor(Math.random()*dishArray.length)];

      db.dish.findAll({
        where: {
          dishGenre: '中華',
          createdBy: req.user.id,
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
        user: req.user,
        maindish: maindish,
        subdish: subdish,
        soup: soup
      });
    }
    });
  }); 
});
});

module.exports = router;