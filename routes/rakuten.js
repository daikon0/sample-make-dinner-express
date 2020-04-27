"use strict";
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//楽天レシピのカテゴリ表示
router.get("/", async (req, res, next) => {
  try {
    const category = await axios.get(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryType=large`
    );
    const categories = category.data.result.large;
    res.render("rakuten", {
      categories: categories
    });
  } catch (err) {
    next(err);
  }
});

//楽天レシピカテゴリ別ランキング表示
router.get("/:categoryId", async (req, res, next) => {
  try {
    const recipe = await axios.get(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryId=${req.params.categoryId}`
    );
    const recipes = recipe.data.result;
    res.render("ranking", {
      recipes: recipes
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
