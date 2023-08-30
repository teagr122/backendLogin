const express = require('express');
const router = express.Router();
const User = require('../router/auth'); 



router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;
