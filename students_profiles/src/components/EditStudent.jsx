import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';


const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    class: '',
    department: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/students/${id}`);
        const { name, studentId, email, phone, address, dob, class: studentClass, department } = res.data;
        setFormData({
          name: name || '',
          studentId: studentId || '',
          email: email || '',
          phone: phone || '',
          address: address || '',
          dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
          class: studentClass || '',
          department: department || '',
        });
      } catch (err) {
        setError('Failed to fetch student data.');
      }
      setIsLoading(false);
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    if (profileImage) {
      submissionData.append('profileImage', profileImage);
    }

    try {
      await axios.put(`/students/${id}`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/view-profile/${id}`);
    } catch (err) {
      setError('Failed to update student.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="edit-student-container">
      <div className="header">
        <h1>Edit Student</h1>
        <button onClick={() => navigate(`/view-profile/${id}`)} className="back-btn">
          Cancel
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleFormSubmit} className="edit-student-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Student ID</label>
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input type="text" name="class" value={formData.class} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
          </div>
          <div className="form-group form-group-full-width">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="submit-btn">Update Student</button>
      </form>
    </div>
  );
};

export default EditStudent;
