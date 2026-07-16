const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({

    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
  
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);
