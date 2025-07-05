const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const staffAuth = require('../middleware/staffAuth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @route   POST api/attendance
// @desc    Mark attendance
// @access  Private
router.post('/', staffAuth, async (req, res) => {
  const { student, date, status } = req.body;

  try {
    const newAttendance = new Attendance({
      student,
      date,
      status
    });

    const attendance = await newAttendance.save();
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
    const attendance = await Attendance.find({ student: student._id }).sort({ date: -1 });
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
    const attendance = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
