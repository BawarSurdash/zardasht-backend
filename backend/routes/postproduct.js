const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models');
const PostProduct = db.PostProduct;

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

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }
    const image = `/uploads/${req.file.filename}`;
    const product = await PostProduct.create({ title, subtitle, description, image, category });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await PostProduct.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await PostProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, subtitle, description, category } = req.body;
    let updateData = { title, subtitle, description, category };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const [updated] = await PostProduct.update(updateData, { where: { id } });
    if (updated) {
      const updatedProduct = await PostProduct.findByPk(id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PostProduct.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
