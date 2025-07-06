const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff'); // Assuming you have a Staff model

// @route   GET /api/users/test
// @desc    Test route to check if the file is loaded
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users route is working' }));

// @route   POST api/users/register
// @desc    Register user (student or staff)
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, role, ...profileData } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create a student or staff profile
    if (role === 'student') {
      const { name, studentId, course, year, section, dateOfBirth, contactNumber, address } = profileData;
      const student = new Student({
        user: user.id,
        name,
        studentId,
        course,
        year,
        section,
        dateOfBirth,
        contactNumber,
        address
      });
      await student.save();
    } else if (role === 'staff') {
      const { name, staffId, age, gender, qualification, experience } = profileData;
      const staff = new Staff({
        user: user.id,
        name,
        staffId,
        age,
        gender,
        qualification,
        experience
      });
      await staff.save();
    } else {
        // Optional: handle cases where the role is neither student nor staff
        return res.status(400).json({ msg: 'Invalid role specified' });
    }


    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      'your_jwt_secret', // Replace with your secret
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      'your_jwt_secret', // Replace with your secret
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/users/search
// @desc    Search for users (students or staff)
// @access  Private
router.get('/search', async (req, res) => {
  const { role, term } = req.query;

  if (!role || !term) {
    return res.status(400).json({ msg: 'Role and search term are required.' });
  }

  try {
    let user;
    if (role === 'student') {
      user = await Student.findOne({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { studentId: { $regex: term, $options: 'i' } },
        ],
      });
    } else if (role === 'staff') {
      // This part will be updated after modifying the User model
      user = await Staff.findOne({
        role: 'staff',
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { staffId: { $regex: term, $options: 'i' } },
        ],
      });
    } else {
      return res.status(400).json({ msg: 'Invalid role specified.' });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/staff/:id
// @desc    Get staff profile by user ID
// @access  Private
router.get('/staff/:id', async (req, res) => {
  try {
    const staffProfile = await Staff.findOne({ user: req.params.id }).populate('user', ['email', 'role']);
    if (!staffProfile) {
      return res.status(404).json({ msg: 'Staff profile not found' });
    }
    res.json(staffProfile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Staff profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
