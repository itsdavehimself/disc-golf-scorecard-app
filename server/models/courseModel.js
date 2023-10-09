const mongoose = require('mongoose');

const { Schema } = mongoose;

const CourseSchema = new Schema({
  courseName: { type: String, required: true },
  courseLocation: { type: String, required: true },
  coursePar: { type: Number, required: true },
  courseImage: { type: String, required: true },
  holes: [{
    holeNumber: { type: Number, required: true },
    par: { type: Number, required: true },
  }],

});

module.exports = mongoose.model('Course', CourseSchema);
