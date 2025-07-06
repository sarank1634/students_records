import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [userType, setUserType] = useState('student'); // 'student' or 'staff'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: '',
    course: '',
    year: '',
    section: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
    staffId: '',
    age: '',
    gender: '',
    qualification: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        role: userType,
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };

      if (userType === 'student') {
        payload.studentId = formData.studentId;
        payload.course = formData.course;
        payload.year = formData.year;
        payload.section = formData.section;
        payload.dateOfBirth = formData.dateOfBirth;
        payload.contactNumber = formData.contactNumber;
        payload.address = formData.address;
      } else {
        payload.staffId = formData.staffId;
        payload.age = formData.age;
        payload.gender = formData.gender;
        payload.qualification = formData.qualification;
        payload.experience = formData.experience;
      }

      await axios.post('/users/register', payload);
      // Redirect to student management or a new staff management page
      navigate('/student-management');
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to create ${userType}.`);
      console.error(err);
    }
  };

  const handleUserTypeChange = (type) => {
      setUserType(type);
      // Reset form data when switching types
      setFormData({
        email: '',
        password: '',
        name: '',
        studentId: '',
        course: '',
        year: '',
        section: '',
        dateOfBirth: '',
        contactNumber: '',
        address: '',
        staffId: '',
        age: '',
        gender: '',
        qualification: '',
        experience: ''
      });
  }

  return (
    <div className="add-student-container"> {/* Using existing class */}
      <div className="header">
        <h1>Add New {userType.charAt(0).toUpperCase() + userType.slice(1)}</h1>
        <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      </div>

      <div className="user-type-toggle">
        <button
          className={userType === 'student' ? 'active' : ''}
          onClick={() => handleUserTypeChange('student')}
        >
          Student
        </button>
        <button
          className={userType === 'staff' ? 'active' : ''}
          onClick={() => handleUserTypeChange('staff')}
        >
          Staff
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-grid">
            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group form-group-full-width">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {userType === 'student' ? (
              <>
                <div className="form-group">
                  <label>Student ID</label>
                  <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <input type="text" name="course" value={formData.course} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <input type="text" name="section" value={formData.section} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                </div>
                <div className="form-group form-group-full-width">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Staff ID</label>
                  <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
                </div>
                <div className="form-group form-group-full-width">
                  <label>Experience (e.g., '5 years')</label>
                  <input type="text" name="experience" value={formData.experience} onChange={handleChange} required />
                </div>
              </>
            )}
        </div>
        <button type="submit" className="submit-btn">Add {userType.charAt(0).toUpperCase() + userType.slice(1)}</button>
      </form>
    </div>
  );
};

export default AddUser;
