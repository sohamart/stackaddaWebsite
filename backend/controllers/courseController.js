const Course = require('../models/Course');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level, requirements, outcomes, thumbnail } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      category,
      level,
      requirements,
      outcomes,
      thumbnail,
      instructor: req.user._id, // Set the creator as the instructor
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses (with optional search & category filter)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    
    let query = {};
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query).populate('instructor', 'name avatar').populate('category', 'name slug');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('category', 'name');

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;
      course.price = req.body.price !== undefined ? req.body.price : course.price;
      course.thumbnail = req.body.thumbnail || course.thumbnail;
      course.level = req.body.level || course.level;
      
      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, enrollCourse };
