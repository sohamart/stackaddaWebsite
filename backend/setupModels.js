const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

const models = [
  { name: 'User', schema: `
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
    avatar: { type: String, default: '' },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  `},
  { name: 'Course', schema: `
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
  `},
  { name: 'Lesson', schema: `
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    youtubeUrl: { type: String, required: true },
    youtubeId: { type: String },
    duration: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    views: { type: String },
    order: { type: Number, default: 0 }
  `},
  { name: 'Category', schema: `
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String }
  `},
  { name: 'Enrollment', schema: `
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
  `},
  { name: 'Progress', schema: `
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercentage: { type: Number, default: 0 }
  `},
  { name: 'Certificate', schema: `
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateUrl: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    qrCode: { type: String }
  `},
  { name: 'Email', schema: `
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
  `},
  { name: 'Notification', schema: `
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  `},
  { name: 'Testimonial', schema: `
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  `},
  { name: 'Blog', schema: `
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thumbnail: { type: String },
    tags: [String],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  `},
  { name: 'Announcement', schema: `
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  `},
  { name: 'Comment', schema: `
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  `},
  { name: 'Wishlist', schema: `
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  `}
];

models.forEach(model => {
  const fileContent = `const mongoose = require('mongoose');

const ${model.name.toLowerCase()}Schema = new mongoose.Schema({
${model.schema}
}, { timestamps: true });

module.exports = mongoose.model('${model.name}', ${model.name.toLowerCase()}Schema);
`;
  fs.writeFileSync(path.join(modelsDir, `${model.name}.js`), fileContent);
  console.log(`Created ${model.name}.js`);
});
