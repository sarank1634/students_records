import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ViewProfile.css';

const ViewProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/students/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch student profile.');
      }
      setIsLoading(false);
    };
    fetchProfile();
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

  const { name, studentId, email, phone, address, dob, profileImage, attendanceSummary } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={`http://localhost:5000/${profileImage}`} alt={name} />
        <div className="profile-header-info">
          <h2>{name}</h2>
          <p>Student ID: {studentId}</p>
        </div>
      </div>

      <div className="profile-body">
        {/* Left Column: Calendar */}
        <div className="left-column">
          <div className="attendance-calendar-container">
            <h3>Attendance Calendar</h3>
            <Calendar
              tileClassName={getTileClassName}
              className="attendance-calendar"
            />
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="right-column">
          <div className="attendance-summary">
            <h3>Attendance Summary</h3>
            <div className="summary-grid">
              <div className="summary-item present">
                <span>{attendanceSummary.presentDays}</span>
                Present
              </div>
              <div className="summary-item absent">
                <span>{attendanceSummary.absentDays}</span>
                Absent
              </div>
              <div className="summary-item leave">
                <span>{attendanceSummary.leaveDays}</span>
                Leave
              </div>
            </div>
          </div>

          <div className="mark-attendance">
            <h3>Mark Today's Attendance</h3>
            <div className="attendance-buttons">
              <button className="present-btn">Present</button>
              <button className="absent-btn">Absent</button>
            </div>
          </div>

          <div className="profile-details">
            <h3>Personal Details</h3>
            <div className="details-grid">
              <div className="detail-item"><strong>Email</strong><span>{email || 'N/A'}</span></div>
              <div className="detail-item"><strong>Phone</strong><span>{phone || 'N/A'}</span></div>
              <div className="detail-item"><strong>Address</strong><span>{address || 'N/A'}</span></div>
              <div className="detail-item"><strong>Date of Birth</strong><span>{dob ? new Date(dob).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
