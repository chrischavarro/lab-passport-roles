const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean,
  students: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
