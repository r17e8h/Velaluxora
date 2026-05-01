import express from 'express';
import axios from 'axios';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Otp from '../models/otpModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      generateToken(res, user._id); 
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/send-otp', async (req, res) => {
  const phoneRaw = req.body.phone || req.body.phoneNumber; 

  if (!phoneRaw || phoneRaw.length < 10) {
    return res.status(400).json({ message: 'Please enter a valid phone number' });
  }
  const cleanPhoneForSMS = phoneRaw.replace('+91', '').trim();

  try {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ phoneNumber: phoneRaw });
    await Otp.create({ phoneNumber: phoneRaw, otp: generatedOtp });
    await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: generatedOtp,
      route: 'otp',
      numbers: cleanPhoneForSMS, 
    }, {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY
      }
    });

    res.json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error("OTP SEND ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});
router.post('/verify-otp', async (req, res) => {
  const phoneRaw = req.body.phone || req.body.phoneNumber;
  const { otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ phoneNumber: phoneRaw, otp });

    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    } 
    const user = await User.findOne({ phoneNumber: phoneRaw });
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please create an account first.' });
    }
    await Otp.deleteOne({ _id: validOtp._id });
    generateToken(res, user._id); 

    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("OTP VERIFY ERROR:", error);
    res.status(500).json({ message: 'Verification failed' });
  }
});
router.post('/register-otp', async (req, res) => {
  const phoneRaw = req.body.phone || req.body.phoneNumber;
  const { name, email, otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ phoneNumber: phoneRaw, otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const userExists = await User.findOne({ phoneNumber: phoneRaw });
    if (userExists) {
      return res.status(400).json({ message: 'Number is already registered. Please sign in.' });
    }
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
         return res.status(400).json({ message: 'Email is already in use.' });
      }
    }
    const user = await User.create({
      name: name,
      email: email,
      phoneNumber: phoneRaw,
      isAdmin: false,
    });
    await Otp.deleteOne({ _id: validOtp._id });
    generateToken(res, user._id); 

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("OTP REGISTER ERROR:", error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
});
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin && req.user._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete another admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed completely' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;