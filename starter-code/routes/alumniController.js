const express = require('express');
const alumniController = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
const ensureLogin = require('connect-ensure-login');

alumniController.get('/users/alumni', ensureLogin.ensureLoggedIn(), checkRoles('Student'), (req, res, next) => {
  User
    .find({ "role": 'Student' })
    .exec((err, users) => {
      if (err) {
        res.render('index', { message: 'An error has occurred' });
      }
      if (!users) {
        res.render('index', { message: 'No users found' });
      }
      else {
        res.render('profile/index', { users })
      }
    });
});

alumniController.get('/users/:userId/courses', ensureLogin.ensureLoggedIn(), checkRoles('Student'), (req, res, next) => {
  const userId = req.params.userId;

  Course
    .find({ 'students': userId })
    .exec((err, courses) => {
      if (err) {
        res.render('index', { message: 'An error has occurred' });
      }
      else {
        res.render('profile/courses', { courses })
      }
    })
})

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
};

module.exports = alumniController;
