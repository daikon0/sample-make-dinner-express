'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authenticatioon-exsurer');
const uuid = require('uuid');
const db = require('../models/index');
const updatedAt = new Date();
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');
const aws = require('aws-sdk');
aws.config.update({region: 'ap-northeast-1'})
const s3 = new aws.S3();

const storage = s3Storage({
  s3,
  Bucket: 'sample.makediner',
  ACL: 'public-read',
  resize: {
    height: 350
  },
});
const upload = multer({storage: storage});

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', authenticationEnsurer, csrfProtection, (req, res, next) => {
  if (req.user) {
    db.dish.findAll({
      where: { createdBy: req.user.id },
      order: [['"updatedAt"', 'DESC']]
    }).then((dishes) => {
      res.render('menu', {
        user: req.user,
        dishes,
        csrfToken: req.csrfToken()
      });
    });
  }
});

router.get('/new',authenticationEnsurer, csrfProtection, (req, res, next) => {
  res.render('new', { 
    user: req.user,
    csrfToken: req.csrfToken()
   });
});

router.post('/', authenticationEnsurer, upload.single('dishFile'), csrfProtection, (req, res, next) => {
  const dishNameChech = req.body.dishName.length > 0
  const fileChech = req.file
  let dishId = uuid.v4();

  if (!dishNameChech) {
    req.flash('error', '料理名を入力してください！');
    return res.redirect('/menu/new');
  }

  if (fileChech === undefined) {
    db.dish.create({
     dishId: dishId,
     dishName: req.body.dishName,
     dishFile: null,
     dishUrl: req.body.dishUrl || '(未設定)',
     dishGenre: req.body.genre,
     dishRole: req.body.role,
     createdBy: req.user.id,
      updatedAt
      }).then(() => {
       res.redirect('/menu');
    });
  } else {
    db.dish.create({
     dishId: dishId,
     dishName: req.body.dishName,
     dishFile: req.file.Location || null,
     dishUrl: req.body.dishUrl || '(未設定)',
     dishGenre: req.body.genre,
     dishRole: req.body.role,
     createdBy: req.user.id,
      updatedAt
      }).then(() => {
       res.redirect('/menu');
    });
  }
});


router.get('/:dishId/img/:dishFile', authenticationEnsurer, (req, res, next) => {
  db.dish.findOne({
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      }],
    where: {
        dishFile: req.params.dishFile
    },
    order: [['"updatedAt', 'DESC']]
  }).then((dish) => {
    res.render('menu', {
      dish
    })
  });
});

router.get('/:dishId/edit', authenticationEnsurer, (req, res, next) => {
  db.dish.findOne({
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
  db.dish.findOne({
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
  db.dish.findOne({
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
        createdBy: req.user.id,
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
        dishFile: req.file.Location,
        dishUrl: dish.dishUrl || '(未設定)',
        dishGenre: dish.dishGenre,
        dishRole: dish.dishRole,
        createdBy: req.user.id,
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
  db.dish.findAll({
    where: { dishId: dishId}
  }).then((dish) => {
    const promises = dish.map((d) => { return d.destroy(); })
    return Promise.all(promises);
  }).then(() => {
    if (err) return done (err);
    done();
  });
}

router.deleteDish = deleteDish;



module.exports = router;