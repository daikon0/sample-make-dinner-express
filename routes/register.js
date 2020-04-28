"use strict";
const express = require("express");
const router = express.Router();
const flash = require("express-flash-messages");
const db = require("../models/index");
const Crypto = require("crypto");
function getSecureRandom() {
  const buff = Crypto.randomBytes(4);
  const hex = buff.toString("hex");
  return parseInt(hex, 16);
}

router.use(flash());

router.get("/", (req, res, next) => {
  res.render("register");
});

router.post("/", (req, res, next) => {
  const passwordCheck = req.body.password.length > 0;
  const usernameCheck = req.body.username.length > 0;
  if (!usernameCheck) {
    req.flash("error", "ユーザーネームを入力してください！");
    return res.redirect("/register");
  }
  if (!passwordCheck) {
    req.flash("error", "パスワードを入力してください！");
    return res.redirect("/register");
  }
  let id = getSecureRandom();

  db.user
    .create({
      id: id,
      username: req.body.username,
      password: req.body.password
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      req.flash("error", "そのusernameはすでに使われています!");
      return res.redirect("/register");
    });
});

module.exports = router;
