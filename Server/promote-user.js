const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB Connection URI
const dbURI = 'mongodb://localhost:27017/student-attendance';

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address.');
  process.exit(1);
}

const promoteUser = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for script.');

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email '${email}' not found.`);
      return;
    }

    user.role = 'staff';
    await user.save();

    console.log(`Successfully promoted user '${email}' to 'staff'.`);

  } catch (err) {
    console.error('Error promoting user:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

promoteUser();
