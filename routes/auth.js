'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const GitHubStrategy = require('passport-github2');
const GITHUB_CLIENT_ID = '254445ad818738ffbe61';
const GITHUB_CLIENT_SECRET = '76c3d081da9e284e940299788e8334a33215b6ca';

githubAuth();
router.get('/github', passport.authenticate('github', { scope: ['user:email']}),
  (req,res) => {});

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    authRedirect(req, res);
});

function authRedirect(req, res) {
  var loginFrom = req.cookies.loginFrom;
  //オープンリダイレクタ脆弱性対策
  if (loginFrom &&
    loginFrom.indexOf('http://') < 0 &&
    loginFrom.indexOf('https://') < 0) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
}

function githubAuth() {
  handleSession();
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/github/callback'
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));
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