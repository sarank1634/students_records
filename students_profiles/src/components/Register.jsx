import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

const Register = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    staffId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { name, email, password, studentId, staffId } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      role: userType,
      name,
      email,
      password,
    };

    if (userType === 'student') {
      payload.studentId = studentId;
    } else {
      payload.staffId = staffId;
    }

    try {
      const res = await axios.post('/users/register', payload);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Register a New Account</h2>
      <div className="user-type-toggle">
        <button 
          className={userType === 'student' ? 'active' : ''}
          onClick={() => setUserType('student')}
        >
          I am a Student
        </button>
        <button 
          className={userType === 'staff' ? 'active' : ''}
          onClick={() => setUserType('staff')}
        >
          I am a Staff Member
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Full Name" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />

        {userType === 'student' ? (
          <input type="text" name="studentId" value={studentId} onChange={onChange} placeholder="Student ID" required />
        ) : (
          <input type="text" name="staffId" value={staffId} onChange={onChange} placeholder="Staff ID" required />
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

