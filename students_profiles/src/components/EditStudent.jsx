import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import './EditStudent.css';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [dob, setDob] = useState('');
  const [classValue, setClassValue] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/students/${id}`);
        const { name, studentId, email, phone, address, dob, class: classValue, department } = res.data;
        setStudentData({ name, studentId, email, phone, address });
        setDob(dob ? new Date(dob).toISOString().split('T')[0] : '');
        setClassValue(classValue || '');
        setDepartment(department || '');
      } catch (err) {
        setError('Failed to fetch student data.');
      }
      setIsLoading(false);
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in studentData) {
      formData.append(key, studentData[key]);
    }
    formData.append('dob', dob);
    formData.append('class', classValue);
    formData.append('department', department);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await axios.put(`/students/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/student-management');
    } catch (err) {
      setError('Failed to update student.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="edit-student-container">
      <h2>Edit Student</h2>
      <form onSubmit={handleFormSubmit} className="edit-student-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={studentData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Student ID</label>
          <input type="text" name="studentId" value={studentData.studentId} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={studentData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={studentData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={studentData.address} onChange={handleChange} />
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
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default EditStudent;
