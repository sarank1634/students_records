import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';


const UpdateAttendance = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student'); // 'student' or 'staff'
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setFoundUser(null);

    if (!searchTerm) {
      setError('Please enter a name or ID.');
      return;
    }

    try {
      const res = await axios.get(`users/search?role=${userType}&term=${searchTerm}`);
      if (res.data) {
        setFoundUser(res.data);
      } else {
        setError('No user found with the provided details.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during search.');
    }
  };

  const handleMarkAttendance = async (status) => {
    if (!foundUser) return;

    try {
      await axios.post('attendance', {
        userId: foundUser._id,
        userType: userType,
        status,
      });
      setMessage(`${foundUser.name}'s attendance marked as ${status}. Redirecting...`);
      
      setTimeout(() => {
        navigate('/student-management');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to mark attendance.');
    }
  };

  return (
    <div className="update-attendance-container">
      <div className="header">
        <h1>Update Attendance</h1>
      </div>

      <div className="user-type-toggle">
        <button
          className={userType === 'student' ? 'active' : ''}
          onClick={() => setUserType('student')}
        >
          Student
        </button>
        <button
          className={userType === 'staff' ? 'active' : ''}
          onClick={() => setUserType('staff')}
        >
          Staff
        </button>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Enter ${userType === 'student' ? 'Student Name or Roll No.' : 'Staff Name or ID'}`}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {foundUser && (
        <div className="found-user-card">
          <img 
            src={`http://localhost:5000/${foundUser.profileImage}`}
            alt={foundUser.name} 
            className="profile-image-small" 
          />
          <div className="user-details">
            <p><strong>Name:</strong> {foundUser.name}</p>
            <p><strong>{userType === 'student' ? 'Roll No:' : 'Staff ID:'}</strong> {foundUser.studentId || foundUser.staffId}</p>
            <p><strong>Department:</strong> {foundUser.department}</p>
          </div>
          <div className="attendance-actions">
            <button className="present-btn" onClick={() => handleMarkAttendance('Present')}>Present</button>
            <button className="absent-btn" onClick={() => handleMarkAttendance('Absent')}>Absent</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateAttendance;
