const express = require('express');
const router = express.Router();
const { addLessonToCourse, getCourseLessons, updateLesson, completeLesson, addComment, getComments } = require('../controllers/lessonController');
const { protect, admin } = require('../middleware/authMiddleware');

// Mount routes
// POST /api/lessons
router.route('/')
  .post(protect, admin, addLessonToCourse);

// GET /api/lessons/course/:courseId
router.route('/course/:courseId')
  .get(getCourseLessons);

// PUT /api/lessons/:id
router.route('/:id')
  .put(protect, admin, updateLesson);

// POST /api/lessons/:id/complete
router.route('/:id/complete')
  .post(protect, completeLesson);

// GET/POST /api/lessons/:id/comments
router.route('/:id/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;
