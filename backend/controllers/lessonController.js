const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');
const Comment = require('../models/Comment');
const axios = require('axios');

// Helper to extract YouTube ID
const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to format ISO 8601 duration (PT1H2M10S) to HH:MM:SS
const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  
  let result = '';
  if (hours > 0) result += hours + ':';
  result += (minutes < 10 ? '0' + minutes : minutes) + ':';
  result += (seconds < 10 ? '0' + seconds : seconds);
  
  return result;
};

// @desc    Add a YouTube lesson to a course
// @route   POST /api/lessons
// @access  Private/Admin
const addLessonToCourse = async (req, res) => {
  const { courseId, youtubeUrl, youtubeId: explicitYoutubeId, order, isPrivate, allowedEmails, isLive } = req.body;

  try {
    let youtubeId = explicitYoutubeId;
    let snippet, contentDetails, statistics;

    if (youtubeUrl) {
      youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) {
        return res.status(400).json({ message: 'Invalid YouTube URL' });
      }
    }

    if (!youtubeId) {
      return res.status(400).json({ message: 'No YouTube Video ID provided' });
    }

    // Fetch video metadata from YouTube API
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const ytUrl = `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${API_KEY}&part=snippet,contentDetails,statistics`;
    
    const response = await axios.get(ytUrl);
    
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'YouTube video not found or private' });
    }

    const videoData = response.data.items[0];
    snippet = videoData.snippet;
    contentDetails = videoData.contentDetails;
    statistics = videoData.statistics;

    const lesson = await Lesson.create({
      title: snippet.title,
      course: courseId,
      youtubeUrl,
      youtubeId,
      duration: formatDuration(contentDetails.duration),
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      description: snippet.description,
      views: statistics.viewCount,
      order: order || 0,
      isPrivate: isPrivate || false,
      allowedEmails: allowedEmails || [],
      isLive: isLive || false
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public
const getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lesson (privacy settings, etc)
// @route   PUT /api/lessons/:id
// @access  Private/Admin
const updateLesson = async (req, res) => {
  try {
    const { isPrivate, allowedEmails, order } = req.body;
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (isPrivate !== undefined) lesson.isPrivate = isPrivate;
    if (allowedEmails !== undefined) lesson.allowedEmails = allowedEmails;
    if (order !== undefined) lesson.order = order;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle lesson completion status
// @route   POST /api/lessons/:id/complete
// @access  Private
const completeLesson = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const lessonId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lessonIndex = user.completedLessons.indexOf(lessonId);
    
    if (lessonIndex === -1) {
      // Mark as completed
      user.completedLessons.push(lessonId);
    } else {
      // Unmark as completed
      user.completedLessons.splice(lessonIndex, 1);
    }

    await user.save();
    res.json({ completedLessons: user.completedLessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a lesson
// @route   POST /api/lessons/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const lessonId = req.params.id;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.create({
      user: req.user._id,
      lesson: lessonId,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a lesson
// @route   GET /api/lessons/:id/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ lesson: req.params.id })
      .populate('user', 'name avatar role')
      .sort('-createdAt');
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addLessonToCourse, getCourseLessons, updateLesson, completeLesson, addComment, getComments };
