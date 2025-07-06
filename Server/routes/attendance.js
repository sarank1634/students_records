const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const staffAuth = require('../middleware/staffAuth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @route   POST api/attendance
// @desc    Mark attendance for a user (student or staff)
// @access  Private (Staff)
router.post('/', staffAuth, async (req, res) => {
  const { userId, userType, status } = req.body;

  if (!userId || !userType || !status) {
    return res.status(400).json({ msg: 'User ID, user type, and status are required.' });
  }

  // Map userType to the correct model name
  const onModel = userType === 'student' ? 'Student' : 'User';

  try {
    // Check if user exists
    const userExists = await mongoose.model(onModel).findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Get the start and end of the current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find if a record for today already exists
    let attendance = await Attendance.findOne({
      user: userId,
      onModel,
      date: { $gte: today, $lt: tomorrow }
    });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.date = new Date(); // Update timestamp
      await attendance.save();
    } else {
      // Create new record
      attendance = await Attendance.create({
        user: userId,
        onModel,
        status,
        date: new Date()
      });
    }

    // Also update the student's main record
    if (onModel === 'Student') {
      // Recalculate and update the attendance summary
      const allAttendance = await Attendance.find({ user: userId, onModel: 'Student' });
      const summary = {
        presentDays: allAttendance.filter(r => r.status === 'Present').length,
        absentDays: allAttendance.filter(r => r.status === 'Absent').length,
        leaveDays: 0 // Placeholder for leave logic
      };

      await Student.findByIdAndUpdate(userId, {
        todaysAttendance: status,
        attendanceSummary: summary
      });
    }

    console.log('Result:', attendance);
    console.log('-------------------------');

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/me
// @desc    Get my attendance records
// @access  Private (Student)
router.get('/me', auth, async (req, res) => {
  try {
    // Find the student profile linked to the user ID
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ msg: 'Student profile not found' });
    }

    // Fetch attendance for that student profile
    const attendance = await Attendance.find({ user: student._id, onModel: 'Student' }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/:studentId
// @desc    Get attendance for a student
// @access  Private
router.get('/:studentId', staffAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.studentId, onModel: 'Student' }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
