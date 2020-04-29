"use strict";
const express = require("express");
const router = express.Router();
const authenticationEnsurer = require("./authenticatioon-exsurer");
const flash = require("express-flash-messages");
const db = require("../models/index");

router.use(flash());

router.get("/", authenticationEnsurer, (req, res, next) => {
  res.render("selectGenre", {
    user: req.user
  });
});

router.get("/japan", authenticationEnsurer, async (req, res, next) => {
  const maindish = await selectDish(req, "和食", "主菜");
  const subdish = await selectDish(req, "和食", "副菜");
  const soup = await selectDish(req, "和食", "汁物");

  if (maindish === undefined || subdish === undefined || soup === undefined) {
    req.flash("error", "料理をもっと作ってください！！");
    res.redirect("/selectGenre");
  } else {
    res.render("result", {
      user: req.user,
      maindish: maindish,
      subdish: subdish,
      soup: soup
    });
  }
});

router.get("/western", authenticationEnsurer, async (req, res, next) => {
  const maindish = await selectDish(req, "洋食", "主菜");
  const subdish = await selectDish(req, "洋食", "副菜");
  const soup = await selectDish(req, "洋食", "汁物");

  if (maindish === undefined || subdish === undefined || soup === undefined) {
    req.flash("error", "料理をもっと作ってください！！");
    res.redirect("/selectGenre");
  } else {
    res.render("result", {
      user: req.user,
      maindish: maindish,
      subdish: subdish,
      soup: soup
    });
  }
});

router.get("/china", authenticationEnsurer, async (req, res, next) => {
  const maindish = await selectDish(req, "中華", "主菜");
  const subdish = await selectDish(req, "中華", "副菜");
  const soup = await selectDish(req, "中華", "汁物");

  if (maindish === undefined || subdish === undefined || soup === undefined) {
    req.flash("error", "料理をもっと作ってください！！");
    res.redirect("/selectGenre");
  } else {
    res.render("result", {
      user: req.user,
      maindish: maindish,
      subdish: subdish,
      soup: soup
    });
  }
});

async function selectDish(req, genre, role) {
  const dish = await db.dish.findAll({
    where: {
      dishGenre: genre,
      createdBy: req.user.id,
      dishRole: role
    }
  });
  const dishArray = [];
  dish.forEach(dish => {
    dishArray.push(dish);
  });
  return romdomDish(dishArray);
}

function romdomDish(dishArray) {
  return dishArray[Math.floor(Math.random() * dishArray.length)];
}

module.exports = router;
