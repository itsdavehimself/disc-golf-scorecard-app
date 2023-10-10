const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Course = require('../models/courseModel');

exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ name: 1 });
  res.status(200).json(courses);
});

exports.getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Course does not exist' });
  }

  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ error: 'Course does not exist' });
  }

  res.status(200).json({ course });
});
