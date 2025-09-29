const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    let { number, email, password, role } = req.body;
    email = email.toLowerCase();

    const validRoles = ['student', 'tutor'];
    role = validRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'student';

    const existing = await User.findOne({ $or: [{ email }, { number }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      number,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'Registered successfully',
      userId: newUser._id,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const normalizedRole = user.role.toLowerCase();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: normalizedRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: normalizedRole,
      user: {
        id: user._id,
        email: user.email,
        number: user.number,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

module.exports = { registerUser, loginUser };
