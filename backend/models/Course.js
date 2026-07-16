const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    ratings: { type: Number, default: 0 },
    requirements: [String],
    outcomes: [String]
  
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
