const express = require('express');
const router = express.Router();
const { getChannelStats, getChannelVideos } = require('../controllers/youtubeController');

router.get('/channel', getChannelStats);
router.get('/videos', getChannelVideos);

module.exports = router;
