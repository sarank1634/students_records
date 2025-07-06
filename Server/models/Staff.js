const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: String, // e.g., '5 years'
    required: true
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  }
});

module.exports = mongoose.model('Staff', StaffSchema);
