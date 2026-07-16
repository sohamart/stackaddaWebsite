const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
