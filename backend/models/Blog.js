const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thumbnail: { type: String },
    tags: [String],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
