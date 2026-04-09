const express = require('express');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/skills  — public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, level: -1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills  — admin only
router.post('/', protect, async (req, res) => {
  try {
    const { name, level, category, icon, order } = req.body;
    if (!name || level === undefined) {
      return res.status(400).json({ success: false, message: 'Name and level are required.' });
    }
    const skill = await Skill.create({
      name, level: Number(level), category, icon, order: order ? Number(order) : 0,
    });
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id  — admin only
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, level, category, icon, order } = req.body;
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

    if (name) skill.name = name;
    if (level !== undefined) skill.level = Number(level);
    if (category) skill.category = category;
    if (icon) skill.icon = icon;
    if (order !== undefined) skill.order = Number(order);

    await skill.save();
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id  — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
