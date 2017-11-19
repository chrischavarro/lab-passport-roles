const express = require('express');
const bossController = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

bossController.get('/', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {
  User
    .find({ role: { $ne: 'Boss' }})
    .exec((err, users) => {
      if (err || !users) {
      res.render('auth/login', { error: 'An error occured' });
    } else {
      res.render('admin/show', { users });
    }
  });
});

bossController.get('/:userId/edit', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {
  const userId = req.params.userId;

  User
    .findOne({ "_id": userId })
    .exec((err, user) => {
      if (err || !user) {
        res.render('/', { error: 'An error occurred'});
      } else {
        res.render('admin/edit', { user })
      }
    });
});

bossController.post('/:userId', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {
  const userId = req.params.userId
  const userRole = req.body.role

  const updatedUserRole = {
    role: userRole
  }

  User
    .findOneAndUpdate({ "_id": userId}, updatedUserRole)
    .exec((err) => {
      if (err) {
        res.render('/', { error: 'An error occurred' });
      } else {
        res.redirect('/');
      }
    });
});

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = bossController;
