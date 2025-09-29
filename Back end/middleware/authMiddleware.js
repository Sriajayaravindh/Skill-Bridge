const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ message: 'Invalid token. Authorization failed.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Authorization denied.' });
    }

    const normalizedRole = (decoded.role || user.role)?.toLowerCase();
    if (!['student', 'tutor'].includes(normalizedRole)) {
      return res.status(401).json({ message: 'Invalid or missing role. Authorization denied.' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: normalizedRole,
    };

    next();
  } catch (err) {
    console.error('protect middleware error:', err.message);
    res.status(500).json({ message: 'Internal server error during authorization' });
  }
};

module.exports = { protect };
