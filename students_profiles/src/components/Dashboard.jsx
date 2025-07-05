import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // We'll create this file for styling

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-menu">
        <Link to="/student-management" className="dashboard-card">
          <h3>Manage Student Profiles</h3>
          <p>Add, edit, or remove student details.</p>
        </Link>
        <Link to="/attendance" className="dashboard-card">
          <h3>Update Attendance</h3>
          <p>Mark daily attendance for students.</p>
        </Link>
        <Link to="/register" className="dashboard-card">
          <h3>Add New User</h3>
          <p>Register a new user account (student or staff).</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
