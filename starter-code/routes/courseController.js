const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const ensureLogin = require("connect-ensure-login");
const courseRouter = express.Router();

courseRouter.get('/', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  Course
    .find({})
    .exec((err, courses) => {
      if (err || !courses) {
        res.render('/index', { message: 'An error occurred' });
      } else {
        res.render('courses/show', { courses })
      }
    });
});

courseRouter.get('/new', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  res.render('courses/create');
})

courseRouter.post('/create', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;

  Course
    .find({ "name": name})
    .exec((course) => {
      if (course !== null) {
        res.render('courses/create', { message: 'This course already exists' })
        console.log(name, startingDate, endDate, level, available);
        console.log(course);
        return;
      }

      const newCourse = new Course({
        name,
        startingDate,
        endDate,
        level,
        available
      });
      newCourse.save((err) => {
        if (err) {
          res.render('/courses/create', { message: 'An error occurred' });
        } else {
          res.redirect('/');
        }
      });
    });
});

courseRouter.get('/:courseId/edit', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;

  Course
    .findOne({ "_id": courseId })
    .exec((err, course) => {
      if (err || !course) {
        res.redirect('/courses');
      } else {

        User.find({ 'role': 'Student'}, (err, users) => {
          if (err) {
            console.log('An error occured finding users')
          } else {
            res.render('courses/edit', {
              course,
              startDate: course.startingDate.toISOString().substring(0, 10),
              endDate: course.endDate.toISOString().substring(0, 10),
              available: course.available,
              users
            });
          }
        })
      };
    });
});

courseRouter.post('/:courseId', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;

  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;
  const students = req.body.students;

  const updatedCourse = {
    name,
    startingDate,
    endDate,
    level,
    available,
    students
  }

  Course
    .findOneAndUpdate({ "_id": courseId }, updatedCourse)
    .exec((err, user) => {
      if (err) {
        res.render('courses/show', user, { message: 'An error occurred' });
        console.log(students)
      } else {
        res.redirect('/courses')
        console.log(students)
      }
    });
});

courseRouter.post('/:courseId/delete', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;

  Course
    .findByIdAndRemove({ "_id": courseId })
    .exec((err) => {
      if (err) {
        res.render('courses/show', { message: 'An error occurred' });
      } else {
        res.redirect('/courses')
      }
    })
})

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


module.exports = courseRouter;
