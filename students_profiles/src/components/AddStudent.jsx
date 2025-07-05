import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './AddStudent.css';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('studentId', studentId);
    formData.append('class', classValue);
    formData.append('department', department);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('dob', dob);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await axios.post('/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/student-management');
    } catch (err) {
      setError('Failed to add student. Please try again.');
    }
  };

  return (
    <div className="add-student-container">
      <h2>Add New Student</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleFormSubmit} className="add-student-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Student ID</label>
          <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Class</label>
          <input type="text" value={classValue} onChange={(e) => setClassValue(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Profile Image</label>
          <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
        </div>
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
