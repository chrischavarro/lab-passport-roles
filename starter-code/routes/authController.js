const express = require('express');
const authController = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
  
authController.get('/auth/facebook', passport.authenticate('facebook'));
authController.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

authController.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
});

authController.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

authController.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('auth/signup', { error: 'You must provide a username and password' });
  }

  User
    .findOne({ username })
    .exec((err, user) => {
      if (err) {
        res.render('auth/signup', { error: 'An error occurred' });
        return;
      }
      if (user !== null) {
        res.render('auth/signup', { error: 'That username is already taken' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render('auth/signup', { error: 'An error occurred' });
        } else {
        res.redirect('/login');
        }
      });
    });
});


module.exports = authController;
