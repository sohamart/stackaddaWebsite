const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({

    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    youtubeUrl: { type: String, required: true },
    youtubeId: { type: String },
    duration: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    views: { type: String },
    order: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    allowedEmails: [{ type: String }],
    isLive: { type: Boolean, default: false }
  
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
