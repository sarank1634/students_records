import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import axios from '../api';
import './Attendance.css';

const Attendance = () => {
  const [userRole, setUserRole] = useState(null);
  const [myAttendance, setMyAttendance] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // State for add student form (staff only)
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.user.role);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid session. Please log in again.");
      }
    }
  }, []);

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      if (userRole === 'student') {
        try {
          const res = await axios.get('/attendance/me');
          setMyAttendance(res.data);
        } catch (err) {
          setError('Could not fetch your attendance records.');
          console.error(err);
        }
      }
    };

    if (userRole) {
      fetchStudentAttendance();
    }
  }, [userRole]);

  // Handler for adding a student (staff only)
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', newStudentName);
      formData.append('studentId', newStudentId);

      await axios.post('/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setNewStudentName('');
      setNewStudentId('');
      setMessage('Student added successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding student.');
    }
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Management</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {userRole === 'staff' && (
        <div className="staff-attendance-view">
            <div className="update-attendance-link-container">
            <h3>Update Daily Attendance</h3>
            <p>To mark or update student attendance for a specific class and department, use the dedicated page.</p>
            <Link to="/update-attendance" className="update-attendance-link">
              Go to Update Attendance
            </Link>
          </div>

          <div className="add-student-form-container">
            <h3>Add a New Student</h3>
            <form onSubmit={handleAddStudent} className="add-student-form">
              <div className="form-group">
                <label htmlFor="newStudentName">Student Name</label>
                <input
                  type="text"
                  id="newStudentName"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newStudentId">Student ID</label>
                <input
                  type="text"
                  id="newStudentId"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="add-student-button">Add Student</button>
            </form>
          </div>
        </div>
      )}

      {userRole === 'student' && (
        <div className="student-attendance-view">
          <h3>My Attendance Records</h3>
          {myAttendance.length > 0 ? (
            <ul className="attendance-list">
              {myAttendance.map(record => (
                <li key={record._id} className={`attendance-item ${record.status.toLowerCase()}`}>
                  <span className="date">{new Date(record.date).toLocaleDateString()}</span>
                  <span className="status">{record.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance records found.</p>
          )}
        </div>
      )}
    </div>
  );
};



export default Attendance;
