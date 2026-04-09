const express = require('express');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/profile  — public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile  — admin only
router.put('/', protect, async (req, res) => {
  try {
    const allowed = ['name', 'title', 'bio', 'about', 'email', 'phone', 'location', 'github', 'linkedin', 'twitter'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    Object.assign(profile, updates);
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/upload-image  — admin only
router.post('/upload-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    // Delete old image file if exists
    if (profile.profileImage) {
      const oldPath = path.join(__dirname, '../uploads', profile.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    profile.profileImage = req.file.filename;
    await profile.save();

    res.json({
      success: true,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/upload-cv  — admin only
router.post('/upload-cv', protect, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    // Delete old CV if exists
    if (profile.cvFile) {
      const oldPath = path.join(__dirname, '../uploads', profile.cvFile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    profile.cvFile = req.file.filename;
    await profile.save();

    res.json({
      success: true,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/profile/remove-image  — admin only
router.delete('/remove-image', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (profile && profile.profileImage) {
      const filePath = path.join(__dirname, '../uploads', profile.profileImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      profile.profileImage = null;
      await profile.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
