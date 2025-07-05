const express = require('express');
const router = express.Router();
const staffAuth = require('../middleware/staffAuth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const multer = require('multer');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST api/students
// @desc    Add a new student
// @access  Private
router.post('/', staffAuth, upload.single('profileImage'), async (req, res) => {
  const { name, studentId, email, phone, address, dob, class: studentClass, department } = req.body;

  try {
    const profileImage = req.file ? req.file.path : '';
    const newStudent = new Student({
      name,
      studentId,
      email,
      phone,
      address,
      dob,
      class: studentClass,
      department,
      profileImage: req.file ? req.file.path : '',
    });

    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/meta
// @desc    Get unique classes and departments for filtering
// @access  Private (Staff)
router.get('/meta', staffAuth, async (req, res) => {
  try {
    const classes = await Student.distinct('class').then(c => c.filter(Boolean));
    const departments = await Student.distinct('department').then(d => d.filter(Boolean));
    res.json({ classes, departments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students
// @desc    Get all students with optional filters
// @access  Private
router.get('/', staffAuth, async (req, res) => {
  const { page = 1, search = '', class: studentClass, department } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (studentClass && studentClass !== 'all') {
      query.class = studentClass;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    const students = await Student.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean();
    const totalStudents = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limit);

    // Get today's attendance for the fetched students
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await Attendance.find({
      student: { $in: students.map(s => s._id) },
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.student.toString(), record.status);
    });

    // Add attendance status to each student object
    const studentsWithAttendance = students.map(student => ({
      ...student,
      todaysAttendance: attendanceMap.get(student._id.toString()) || 'Not Marked',
    }));

    res.json({ students: studentsWithAttendance, totalPages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get a single student by ID
// @access  Private (Staff)
router.get('/:id', staffAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Fetch detailed attendance records
    const attendanceRecords = await Attendance.find({ student: student._id }).lean();

    // Calculate attendance summary
    const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const absentDays = attendanceRecords.filter(record => record.status === 'Absent').length;
    const leaveDays = attendanceRecords.filter(record => record.status === 'Leave').length;

    const attendanceSummary = { presentDays, absentDays, leaveDays };

    res.json({
      ...student.toObject(),
      attendance: attendanceRecords, // Send the full list of records
      attendanceSummary,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/students/:id
// @desc    Update a student
// @access  Private (Staff)
router.put('/:id', staffAuth, upload.single('profileImage'), async (req, res) => {
  const { name, studentId, email, phone, address, dob, class: studentClass, department } = req.body;

  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.name = name || student.name;
    student.studentId = studentId || student.studentId;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.address = address || student.address;
        student.dob = dob || student.dob;
    if (req.file) {
      student.profileImage = req.file.path;
    }

    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/students/:id
// @desc    Delete a student
// @access  Private (Staff)
router.delete('/:id', staffAuth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /:id/attendance
// @desc    Mark student attendance for today
// @access  Private (Staff)
router.post('/:id/attendance', staffAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const studentId = req.params.id;

    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid attendance status.' });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let attendance = await Attendance.findOne({
      student: studentId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (attendance) {
      // Update today's attendance if it already exists
      attendance.status = status;
      await attendance.save();
      res.json(attendance);
    } else {
      // Create a new attendance record for today
      const newAttendance = new Attendance({
        student: studentId,
        status: status,
        date: new Date(),
      });
      await newAttendance.save();
      res.json(newAttendance);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /attendance-by-details
// @desc    Mark student attendance by name, class, and department
// @access  Private (Staff)
router.post('/attendance-by-details', staffAuth, async (req, res) => {
  const { name, class: studentClass, department, status } = req.body;

  if (!name || !studentClass || !department || !status) {
    return res.status(400).json({ msg: 'Please provide name, class, department, and status.' });
  }

  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid attendance status.' });
  }

  try {
    // Find the student by name, class, and department
    const student = await Student.findOne({
      name: { $regex: `^${name}$`, $options: 'i' }, // Case-insensitive exact match
      class: studentClass,
      department: department,
    });

    if (!student) {
      return res.status(404).json({ msg: 'Student not found with the provided details.' });
    }

    // Now that we have the student ID, proceed with marking attendance
    const studentId = student._id;
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

    let attendance = await Attendance.findOne({
      student: studentId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (attendance) {
      // Update today's attendance if it already exists
      attendance.status = status;
      await attendance.save();
      res.json({ msg: `Attendance for ${student.name} updated to ${status}.`, attendance });
    } else {
      // Create a new attendance record for today
      const newAttendance = new Attendance({
        student: studentId,
        status: status,
        date: new Date(),
      });
      await newAttendance.save();
      res.json({ msg: `Attendance for ${student.name} marked as ${status}.`, newAttendance });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
