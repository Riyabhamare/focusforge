const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config/config');
const { sendPasswordResetOTP } = require('../utils/email');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash, avatar });
    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    delete user.password_hash;

    return res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Return 200 for security so email enumeration is prevented, but log mock OTP
      return res.json({ message: 'If email exists, OTP code has been sent' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendPasswordResetOTP(email, otp);

    return res.json({
      message: `Password reset OTP generated for ${email}`,
      otp: config.nodeEnv === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo@focusforge.app';
    let user = await UserModel.findByEmail(demoEmail);

    if (!user) {
      const passwordHash = await bcrypt.hash('password123', 10);
      user = await UserModel.create({
        name: 'Alex Rivers (Demo)',
        email: demoEmail,
        passwordHash,
        avatar: 'warrior'
      });
    }

    const token = generateToken(user);
    delete user.password_hash;

    return res.json({
      message: 'Demo login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Failed to execute demo login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};
