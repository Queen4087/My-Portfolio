const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },       // URL or uploaded filename
  imageFile: { type: String, default: null }, // uploaded filename
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Other'],
    default: 'Full Stack',
  },
  tags: [{ type: String, trim: true }],
  github: { type: String, default: '' },
  demo: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
