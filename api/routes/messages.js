const express = require('express');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rate limit contact form — 5 messages per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
});

// POST /api/messages  — public (contact form)
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 2000 characters).' });
    }

    const msg = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: { id: msg._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// GET /api/messages  — admin only
router.get('/', protect, async (req, res) => {
  try {
    const { read } = req.query;
    const filter = {};
    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ read: false });

    res.json({ success: true, data: messages, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/messages/:id/read  — admin only
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/messages/mark-all-read  — admin only
router.patch('/mark-all-read', protect, async (req, res) => {
  try {
    await Message.updateMany({ read: false }, { read: true });
    res.json({ success: true, message: 'All messages marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/messages/:id  — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' });
    await msg.deleteOne();
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
