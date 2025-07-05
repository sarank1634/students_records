import React, { useState } from 'react';
import axios from '../api';
import './UpdateAttendance.css';

const UpdateAttendance = () => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    department: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { name, class: studentClass, department } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMarkAttendance = async (status) => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/students/attendance-by-details', {
        name,
        class: studentClass,
        department,
        status,
      });
      setMessage(res.data.msg);
      // Clear form on success
      setFormData({ name: '', class: '', department: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="update-attendance-form-container">
      <h2>Mark Student Attendance</h2>
      <p>Enter student details to mark their attendance for today.</p>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form
        className="attendance-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="form-group">
          <label htmlFor="name">Student Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="e.g., John Doe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="class">Class</label>
          <input
            type="text"
            id="class"
            name="class"
            value={studentClass}
            onChange={onChange}
            required
            placeholder="e.g., 12"
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={department}
            onChange={onChange}
            required
            placeholder="e.g., Computer Science"
          />
        </div>
        <div className="button-group">
          <button
            type="button"
            className="present-btn"
            onClick={() => handleMarkAttendance('Present')}
          >
            Mark Present
          </button>
          <button
            type="button"
            className="absent-btn"
            onClick={() => handleMarkAttendance('Absent')}
          >
            Mark Absent
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAttendance;
