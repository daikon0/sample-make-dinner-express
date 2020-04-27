'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/', async (req, res, next) => {
  const category = await axios.get(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryType=large`)
  const categories = category.data.result.large
  console.log(categories);
  
  res.render('rakuten', {
    categories: categories
  });
});

module.exports = router;