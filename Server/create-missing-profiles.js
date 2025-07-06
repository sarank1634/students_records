const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

const dbURI = 'mongodb://localhost:27017/student-attendance';

const createMissingProfiles = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for script.');

    const users = await User.find();
    let profilesCreated = 0;

    for (const user of users) {
      const studentProfile = await Student.findOne({ user: user._id });
      if (!studentProfile) {
        const newStudent = new Student({
          user: user._id,
          name: user.username,
          studentId: `TEMP-${user._id}` // Placeholder student ID
        });
        await newStudent.save();
        profilesCreated++;
        console.log(`Created student profile for user: ${user.email}`);
      }
    }

    console.log(`Script finished. Created ${profilesCreated} new student profile(s).`);

  } catch (err) {
    console.error('Error creating missing profiles:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

createMissingProfiles();
