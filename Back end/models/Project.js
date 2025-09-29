const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  batch: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  link: {
    type: String,
    trim: true,
    match: /^https?:\/\/.+/,
  },

  files: [
    {
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      fileType: { type: String },
      fileSize: { type: Number },
    }
  ],
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/,
    index: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
