"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../models/index");
require("dotenv").config();

const LocalStrategy = require("passport-local").Strategy;

const GitHubStrategy = require("passport-github2").Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const TwitterStrategy = require("passport-twitter").Strategy;
const TWITTER_CONSUMER_KYE = process.env.TWITTER_CONSUMER_KYE;
const TWITTERCONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

localAuth();
router.post(
  "/local",
  (req, res, next) => {
    const passwordCheck = req.body.password.length > 0;
    const usernameCheck = req.body.username.length > 0;
    if (!usernameCheck) {
      req.flash("error", "ユーザーネームを入力してください！");
      return res.redirect("/login");
    } else if (!passwordCheck) {
      req.flash("error", "パスワードを入力してください！");
      return res.redirect("/login");
    } else {
      next();
    }
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

githubAuth();
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    authRedirect(req, res);
  }
);

twitterAuth();
router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    authRedirect(req, res);
  }
);

function authRedirect(req, res) {
  var loginFrom = req.cookies.loginFrom;
  //オープンリダイレクタ脆弱性対策
  if (
    loginFrom &&
    loginFrom.indexOf("http://") < 0 &&
    loginFrom.indexOf("https://") < 0
  ) {
    res.clearCookie("loginFrom");
    res.redirect(loginFrom);
  } else {
    res.redirect("/");
  }
}

function localAuth() {
  handleSession();
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      function(username, password, done) {
        process.nextTick(() => {
          db.user
            .findOne({ where: { username: username, password: password } })
            .then((user, err) => {
              if (err) {
                return done(err);
              }
              if (!user) {
                return done(null, false, {
                  message: "usernameまたはpasswordが間違っています"
                });
              }
              return done(null, user);
            });
        });
      }
    )
  );
}

function githubAuth() {
  handleSession();
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          db.user
            .upsert({
              id: profile.id,
              username: profile.username
            })
            .then(() => {
              done(null, profile);
            });
        });
      }
    )
  );
}

function twitterAuth() {
  handleSession();
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWITTER_CONSUMER_KYE,
        consumerSecret: TWITTERCONSUMER_SECRET,
        callbackURL: "http://localhost:8000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
          db.user
            .upsert({
              id: profile.id,
              username: profile.username
            })
            .then(() => {
              done(null, profile);
            });
        });
      }
    )
  );
}

function handleSession() {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
}

module.exports = router;
