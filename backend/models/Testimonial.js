const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
