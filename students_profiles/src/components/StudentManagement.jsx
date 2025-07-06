import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';


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
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="student-management-container">
      <div className="header">
        <h1>Student Management</h1>
        <button onClick={() => navigate('/add-student')} className="add-student-btn">
          Add New Student
        </button>
      </div>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, ID, class..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      {isLoading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="table-wrapper">
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
                        <div className="student-info">
                          <img src={`http://localhost:5000/${student.profileImage}`} alt={student.name} className="profile-pic" />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.class}</td>
                      <td>{student.department}</td>
                      <td>
                        <span className={`status-badge ${student.todaysAttendance?.toLowerCase().replace(' ', '-') || 'not-marked'}`}>
                          {student.todaysAttendance || 'Not Marked'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="action-btn view-btn" onClick={() => navigate(`/view-profile/${student._id}`)}>View</button>
                        <button className="action-btn edit-btn" onClick={() => navigate(`/edit-student/${student._id}`)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-students">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentManagement;