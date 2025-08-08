const express = require('express');
const router = express.Router();
const db = require('../models');
const UserSubmit = db.UserSubmit;

// Create a new user submission (contact form)
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const submit = await UserSubmit.create({ firstName, lastName, email, phone, message });
    res.status(201).json(submit);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get all user submissions (for dashboard)
router.get('/', async (req, res) => {
  try {
    const submits = await UserSubmit.findAll({ order: [['createdAt', 'DESC']] });
    res.json(submits);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Delete a user submission by id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await UserSubmit.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'User submission deleted' });
    } else {
      res.status(404).json({ error: 'User submission not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
