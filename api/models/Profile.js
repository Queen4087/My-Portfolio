const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'John Doe' },
  title: { type: String, default: 'Full Stack Developer' },
  bio: { type: String, default: '' },
  about: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  profileImage: { type: String, default: null },  // filename
  cvFile: { type: String, default: null },         // filename
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
