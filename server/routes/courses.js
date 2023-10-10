const express = require('express');

const router = express.Router();

const { getAllCourses, getCourse } = require('../controllers/coursesController');

router.get('/', getAllCourses);

router.get('/:id', getCourse);

module.exports = router;
