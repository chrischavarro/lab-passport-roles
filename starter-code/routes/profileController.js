const express = require('express');
const profileController = express.Router();
const User = require('../models/user');
const ensureLogin = require("connect-ensure-login");

// profileController.use((req, res, next) => {
//   if (req.session.currentUser) { next(); }
//   else { res.redirect('/login'); }
// })

profileController.get('/:userId', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.userId

  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
      if (err || !user) {
        res.redirect('/');
        console.log('An error occurred when viewing profile');
      } else {
        res.render('profile/show', { user, visiting: userId, session: req.session.passport.user })
        // console.log(req.session.passport.user)
      }
    })
});

profileController.get('/:userId/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.userId;

  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
      if (err || !user) {
        res.render('profile/show', { error: 'An error occurred' })
      } else {
        res.render('profile/edit', { user })
      }
    })
})

profileController.post('/:userId', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.userId;
  const username = req.body.username

  const updatedUser = {
    username: username
  }

  User
    .findOneAndUpdate({ "_id": userId }, updatedUser)
    .exec((err) => {
      if (err, !user) {
        res.render(res.render('profile/show', { user, error: 'An error occurred' }));
      } else {
        res.redirect('/');
      }
    })
})

module.exports = profileController;
