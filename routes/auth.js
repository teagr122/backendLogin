  const express = require('express');
  const bcrypt = require('bcrypt');
  const uuid = require('uuid');
  const jwt = require('jsonwebtoken');
  const router = express.Router();

  const User = require('../models/User'); 

  router.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 20);
      const newUser = new User({
        userId: uuid.v4(),
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).send('User not found');
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).send('Invalid login credentials');
      }
      const token = jwt.sign({ userId: user._id }, 'secretKey');
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  module.exports = router;
