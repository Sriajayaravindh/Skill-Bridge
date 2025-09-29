const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    match: /^\d+$/,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    required: true,
    lowercase: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
