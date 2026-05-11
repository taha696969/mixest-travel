const express = require('express');
const router = express.Router();

// Hardcoded admin credentials for "small login page"
const ADMIN_USER = {
  username: 'admin',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    // In a real app, we would return a JWT. For a "small" one, we just return success.
    res.json({ success: true, message: 'Logged in successfully', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
