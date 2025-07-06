import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await axios.get(`students/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load student data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month' && profile && profile.attendance) {
      const dateString = date.toISOString().split('T')[0];
      const record = profile.attendance.find(r => r.date.startsWith(dateString));
      if (record) {
        return `attendance-${record.status.toLowerCase()}`;
      }
    }
    return null;
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  const { name, studentId, email, phone, address, dob, class: studentClass, department, profileImage, attendanceSummary, attendance, todaysAttendance } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-main">
          <img src={`http://localhost:5000/${profileImage}`} alt={name} className="profile-image-large" />
          <div className="header-info">
            <h1>{name}</h1>
            <p>Student ID: {studentId}</p>
            <p className="todays-status-container">
              Today's Status:
              <span className={`status-badge ${todaysAttendance?.toLowerCase().replace(' ', '-') || 'not-marked'}`}>
                {todaysAttendance || 'Not Marked'}
              </span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/student-management')} className="back-btn">Back to List</button>
          <button onClick={() => navigate(`/edit-student/${id}`)} className="edit-btn">Edit</button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-card details-card">
            <h3>Personal Details</h3>
            <ul>
              <li><strong>Email:</strong> <span>{email || 'N/A'}</span></li>
              <li><strong>Phone:</strong> <span>{phone || 'N/A'}</span></li>
              <li><strong>Class:</strong> <span>{studentClass || 'N/A'}</span></li>
              <li><strong>Department:</strong> <span>{department || 'N/A'}</span></li>
            </ul>
          </div>
          <div className="profile-card details-card">
            <ul>
              <li><strong>Date of Birth:</strong> <span>{dob ? new Date(dob).toLocaleDateString() : 'N/A'}</span></li>
              <li className="full-width"><strong>Address:</strong> <span>{address || 'N/A'}</span></li>
            </ul>
          </div>
          <div className="profile-card calendar-card">
            <h3>Attendance Calendar</h3>
            <Calendar tileClassName={getTileClassName} className="attendance-calendar" />
          </div>
        </div>
        <div className="profile-sidebar">
          {attendanceSummary && (
            <div className="profile-card summary-card">
              <h3>Attendance Summary</h3>
              <div className="summary-grid">
                <div className="summary-item present"><span>{attendanceSummary.presentDays}</span>Present</div>
                <div className="summary-item absent"><span>{attendanceSummary.absentDays}</span>Absent</div>
                <div className="summary-item leave"><span>{attendanceSummary.leaveDays}</span>Leave</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
