const express = require('express');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/projects  — public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:id  — public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects  — admin only
router.post('/', protect, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, image, category, tags, github, demo, featured, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const projectData = {
      title, description, category,
      github: github || '',
      demo: demo || '',
      featured: featured === 'true' || featured === true,
      order: order ? Number(order) : 0,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
    };

    if (req.file) {
      projectData.imageFile = req.file.filename;
      projectData.image = `/uploads/${req.file.filename}`;
    } else {
      projectData.image = image || '';
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id  — admin only
router.put('/:id', protect, upload.single('imageFile'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const { title, description, image, category, tags, github, demo, featured, order } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (github !== undefined) project.github = github;
    if (demo !== undefined) project.demo = demo;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;
    if (order !== undefined) project.order = Number(order);
    if (tags) project.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);

    if (req.file) {
      // Delete old uploaded image
      if (project.imageFile) {
        const oldPath = path.join(__dirname, '../uploads', project.imageFile);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.imageFile = req.file.filename;
      project.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      project.image = image;
    }

    await project.save();
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id  — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Delete uploaded image file if exists
    if (project.imageFile) {
      const filePath = path.join(__dirname, '../uploads', project.imageFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
