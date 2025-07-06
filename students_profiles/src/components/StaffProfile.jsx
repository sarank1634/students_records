import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api';

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/users/staff/${id}`);
        setStaff(res.data);
      } catch (err) {
        setError('Failed to fetch staff profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
  }, [id]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!staff) {
    return <div>Staff member not found.</div>;
  }

  return (
    <div className="profile-container"> {/* Re-using existing styles */}
      <div className="profile-header">
        <div className="header-main">
          <img 
            src={`/path/to/images/${staff.profileImage || 'default-profile.png'}`} 
            alt={`${staff.name}'s profile`} 
            className="profile-image-large" 
          />
          <div className="header-info">
            <h1>{staff.name}</h1>
            <p>Staff ID: {staff.staffId}</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate(-1)} className="back-btn">Back</button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-card details-card">
            <h3>Personal Information</h3>
            <ul>
              <li>
                <strong>Full Name</strong>
                <span>{staff.name}</span>
              </li>
              <li>
                <strong>Email</strong>
                <span>{staff.user.email}</span>
              </li>
              <li>
                <strong>Age</strong>
                <span>{staff.age}</span>
              </li>
              <li>
                <strong>Gender</strong>
                <span>{staff.gender}</span>
              </li>
            </ul>
          </div>
          <div className="profile-card details-card">
            <h3>Professional Details</h3>
             <ul>
              <li>
                <strong>Qualification</strong>
                <span>{staff.qualification}</span>
              </li>
              <li>
                <strong>Experience</strong>
                <span>{staff.experience}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="profile-sidebar">
            {/* Future content like assigned courses or schedules can go here */}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
