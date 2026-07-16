const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, updateCourse, enrollCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, admin, updateCourse);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

module.exports = router;
