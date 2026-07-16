const axios = require('axios');

// @desc    Get YouTube Channel Statistics
// @route   GET /api/youtube/channel
// @access  Public
const getChannelStats = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return res.status(400).json({ message: 'YouTube API Key or Channel ID is missing in env' });
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
    
    const response = await axios.get(url);

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const channel = response.data.items[0];
    
    res.json({
      channelId: CHANNEL_ID,
      customUrl: channel.snippet.customUrl,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      statistics: {
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
      }
    });

  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get channel videos (for visual selector)
// @route   GET /api/youtube/videos
// @access  Public (or Private)
const getChannelVideos = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return res.status(400).json({ message: 'YouTube API Key or Channel ID is missing in env' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video&key=${API_KEY}`;
    
    const response = await axios.get(url);
    
    // The search endpoint returns items, we can map them to a cleaner structure
    const videos = response.data.items.map(item => ({
      youtubeId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
      isLive: item.snippet.liveBroadcastContent !== "none", // could be "upcoming" or "live"
    }));

    res.json(videos);
  } catch (error) {
    console.error('YouTube API Error (Videos):', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChannelStats, getChannelVideos };
