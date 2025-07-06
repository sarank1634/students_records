const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  studentId: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  department: { type: String, required: true },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  dob: {
    type: Date
  },
  profileImage: {
    type: String
  },
  todaysAttendance: {
    type: String,
    default: 'Not Marked'
  },
  attendanceSummary: {
    presentDays: { type: Number, default: 0 },
    
  }
});

module.exports = mongoose.model('Student', StudentSchema);
