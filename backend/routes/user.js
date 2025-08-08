const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // For simplicity, just return user info (no JWT/session for now)
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
