const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
router.post('/signup', async (req, res) => {
  const { name, email, password, role = "user" } = req.body; 

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    res.status(201).json({
      message: 'User registered successfully',
      token, 
      user: { name, email, role } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      message: "Login successful",
      token, 
      user: { name: user.name, email: user.email, role: user.role } 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful, please clear the token on the client side.' });
  });
module.exports = router;