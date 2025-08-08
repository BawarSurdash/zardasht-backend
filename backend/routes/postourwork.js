const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models'); // Import Sequelize models
const PostOurWork = db.PostOurWork;

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create a new post
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }
    const images = req.files.map(f => `/uploads/${f.filename}`);
    const post = await PostOurWork.create({ title, subtitle, description, images });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts (with pagination)
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 16 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const { count, rows } = await PostOurWork.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({ posts: rows, total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostOurWork.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PostOurWork.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Post deleted' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, subtitle, description } = req.body;
    let updateData = { title, subtitle, description };
    // Collect existing image URLs from body (may be string or array)
    let existingImages = [];
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        existingImages = req.body.existingImages;
      } else if (typeof req.body.existingImages === 'string') {
        existingImages = [req.body.existingImages];
      }
    }
    // Add new uploaded files
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(f => `/uploads/${f.filename}`);
    }
    // Merge and limit to 5 images
    updateData.images = [...existingImages, ...newImages].slice(0, 5);
    const [updated] = await PostOurWork.update(updateData, { where: { id } });
    if (updated) {
      const updatedPost = await PostOurWork.findByPk(id);
      res.json(updatedPost);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 