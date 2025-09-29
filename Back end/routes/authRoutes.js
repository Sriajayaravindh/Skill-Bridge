const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Optional: manual preflight handler (not needed if global CORS is set)
router.options('/register', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
