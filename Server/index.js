const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/student-attendance';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define Routes
app.use('/api', require('./routes/api'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
