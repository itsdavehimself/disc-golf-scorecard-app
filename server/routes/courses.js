const express = require('express');

const router = express.Router();

const { getAllCourses, getCourse } = require('../controllers/coursesController');

router.get('/courses', getAllCourses);

router.get('/courses/:id', getCourse);

module.exports = router;
