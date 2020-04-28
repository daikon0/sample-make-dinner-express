"use strict";
const express = require("express");
const router = express.Router();
const authenticationEnsurer = require("./authenticatioon-exsurer");
const axios = require("axios");
const uuid = require("uuid");
const db = require("../models/index");
const updatedAt = new Date();
require("dotenv").config();

//楽天レシピのカテゴリ表示
router.get("/", authenticationEnsurer, async (req, res, next) => {
  try {
    const category = await axios.get(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryType=large`
    );
    const categories = category.data.result.large;
    res.render("rakuten", {
      user: req.user,
      categories: categories
    });
  } catch (err) {
    next(err);
  }
});

//楽天レシピカテゴリ別ランキング表示
router.get("/:categoryId", authenticationEnsurer, async (req, res, next) => {
  try {
    const recipe = await axios.get(
      `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryId=${req.params.categoryId}`
    );
    const recipes = recipe.data.result;
    const categoryId = req.params.categoryId;
    res.render("ranking", {
      user: req.user,
      recipes: recipes,
      categoryId: categoryId
    });
  } catch (err) {
    next(err);
  }
});

//レシピ表示
router.get(
  "/:categoryId/:recipeId",
  authenticationEnsurer,
  async (req, res, next) => {
    try {
      const categories = await axios.get(
        `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${process.env.RAKUTEN_APP}&categoryId=${req.params.categoryId}`
      );
      const recipes = categories.data.result;
      const recipe = recipes.filter(function(item) {
        if (item.recipeId == req.params.recipeId) return true;
      });
      res.render("recipe", {
        user: req.user,
        recipe: recipe
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/recipe", authenticationEnsurer, (req, res, next) => {
  res.render("newRakuten", {
    user: req.user,
    dishName: req.body.dishName,
    dishUrl: req.body.dishUrl,
    dishFile: req.body.dishFile
  });
});

router.post("/recipe/new", authenticationEnsurer, async (req, res, next) => {
  const hasDishName = req.body.dishName.length > 0;
  const dishId = uuid.v4();

  if (!hasDishName) {
    req.flash("error", "料理名を入力してください！");
    return res.redirect("/rakuten/recipe/new");
  }

  await db.dish.create({
    dishId: dishId,
    dishName: req.body.dishName,
    dishFile: req.body.dishFile,
    dishUrl: req.body.dishUrl,
    dishGenre: req.body.genre,
    dishRole: req.body.role,
    createdBy: req.user.id,
    updatedAt
  });

  res.redirect("/menu");
});

module.exports = router;
