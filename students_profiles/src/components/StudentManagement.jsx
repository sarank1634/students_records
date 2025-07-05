import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/students?page=${currentPage}&search=${searchTerm}`);
      // The backend sends an object { students: [], totalPages: X }
      // We must ensure we are setting the students state to the array
      setStudents(res.data.students || []); 
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch students', err);
      setError('Failed to fetch students. Please try again.');
    }
    setIsLoading(false);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents(); // Refetch students after deletion
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  if (isLoading) {
    return <p>Loading students...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="student-management-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, ID, class..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Department</th>
            <th>Today's Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map(student => (
              <tr key={student._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={`http://localhost:5000/${student.profileImage}`} alt={student.name} className="profile-pic" />
                    <span>{student.name}</span>
                  </div>
                </td>
                <td>{student.class}</td>
                <td>{student.department}</td>
                <td className="status-cell">
                  <span className={`status-badge ${student.todaysAttendance?.toLowerCase().replace(' ', '-')}`}>
                    {student.todaysAttendance || 'Not Marked'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => navigate(`/view-profile/${student._id}`)}>View</button>
                  <button onClick={() => navigate(`/edit-student/${student._id}`)}>Edit</button>
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentManagement;