'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const uuid = require('uuid');
const Dish = require('../models/dish');
const User = require('../models/user');
const updatedAt = new Date();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, fiel, cb) {
    cb(null, './public/images/upload/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });
const fs = require("fs");
const moment = require('moment-timezone');

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

router.post('/', authenticationEnsurer, upload.single('dishFile'), (req, res, next) => {
  const dishNameChech = req.body.dishName.length > 0
  const fileChech = req.file
  let dishId = uuid.v4();
  console.log(fileChech);
  

  if (!dishNameChech) {
    req.flash('error', '料理名を入力してください！');
    return res.redirect('/menu/new');
  }

  if (fileChech === undefined) {
    req.flash('error', '画像を選択してください！');
    return res.redirect('/menu/new');
  }

  Dish.create({
   dishId: dishId,
   dishName: req.body.dishName,
   dishFile: req.file.originalname || null,
   dishUrl: req.body.dishUrl || '(未設定)',
   dishGenre: req.body.genre,
   dishRole: req.body.role,
   createdBy: req.user.userId,
    updatedAt
    }).then(() => {
     res.redirect('/menu');
  });
});

router.get('/:dishId/img/:dishFile', authenticationEnsurer, (req, res, next) => {
  Dish.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
        dishFile: req.params.dishFile
    },
    order: [['"updatedAt', 'DESC']]
  }).then((dish) => {
    console.log(dish.dishFile);
    res.writeHead(200,{"Content-Type": getType(dish.dishFile)});
    const output = fs.readFileSync(`./public/images/upload/${dish.dishFile}`)
    res.end(output);
  });
});

function getType(url){
  const types = {
    ".html": "text/html",
    ".css" : "text/css",
    ".js"  : "text/javascript",
    ".png" : "image/png",
    ".jpg" : "image/jpeg",
    ".gif" : "image/gif",
    ".svg" : "svg+xml"
  }
  for (const key in types) {
    if(url.endsWith(key)){
      return types[key];;
    }
  }
}

router.get('/:dishId/edit', authenticationEnsurer, (req, res, next) => {
  Dish.findOne({
    where: {
      dishId: req.params.dishId
    }
  }).then((dish) => {
    res.render('edit', {
      user: req.user,
      dish: dish
    });
  });
});

router.get('/:dishId/edit/img',authenticationEnsurer, (req, res, next) => {
  Dish.findOne({
    where: {
      dishId: req.params.dishId
    }
  }).then((dish) => {
    res.render('editImg', {
      user: req.user,
      dish: dish
    });
  });
});

router.post('/:dishId', authenticationEnsurer, upload.single('dishFile'), (req, res, next) => {
  Dish.findOne({
    where: {
      dishId: req.params.dishId
    }
  }).then((dish) => {
    if (parseInt(req.query.delete) === 1){
      deleteDish(req.params.dishId, () => {
        res.redirect('/menu');
      });
    } else if(parseInt(req.query.edit) === 1) {
      const dishNameChech = req.body.dishName.length > 0

      if (!dishNameChech) {
        req.flash('error', '料理名を入力してください！');
        return res.redirect(`/menu/${dish.dishId}/edit`);
      }

      dish.update({
        dishId: dish.dishId,
        dishName: req.body.dishName,
        dishFile: dish.dishFile,
        dishUrl: req.body.dishUrl || '(未設定)',
        dishGenre: dish.dishGenre,
        dishRole: dish.dishRole,
        createdBy: req.user.userId,
        updatedAt
      });
      res.redirect('/menu');
    } else if (parseInt(req.query.editImg) === 1){
      const fileChech = req.file

      if (fileChech === undefined) {
        req.flash('error', '画像を選択してください！');
        return res.redirect(`/menu/${dish.dishId}/edit/img`);
      }
      dish.update({
        dishId: dish.dishId,
        dishName: dish.dishName,
        dishFile: req.file.filename,
        dishUrl: dish.dishUrl || '(未設定)',
        dishGenre: dish.dishGenre,
        dishRole: dish.dishRole,
        createdBy: req.user.userId,
        updatedAt
      });
      res.redirect(`/menu/${dish.dishId}/edit`)
    } else {
      const err = new Error('不正なリクエストです');
      err.status = 400;
      next(err);
    }
  });
});

function deleteDish(dishId, done, err) {
  Dish.findAll({
    where: { dishId: dishId}
  }).then((dish) => {
    const promises = dish.map((d) => { return d.destroy(); })
    return Promise.all(promises);
  }).then(() => {
    if (err) return done (err);
    done();
  });
}



module.exports = router;