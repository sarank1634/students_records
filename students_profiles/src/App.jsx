import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import Attendance from './components/Attendance';
import StudentManagement from './components/StudentManagement';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import ViewProfile from './components/ViewProfile';
import Dashboard from './components/Dashboard';
import UpdateAttendance from './components/UpdateAttendance';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  // Use a wrapper component to get access to the useNavigate hook
  const AppContent = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole(null);
      navigate('/login');
    };

    useEffect(() => {
      const handleAuthChange = () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUserRole(decoded.user.role);
          } catch (error) {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUserRole(null);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      };

      window.addEventListener('authChange', handleAuthChange);
      handleAuthChange(); // Initial check on component mount

      return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    return (
      <div>
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
                {userRole === 'staff' ? (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/attendance">Attendance</Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-management"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StudentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-student"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-student/:id"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <EditStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-profile/:id"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-attendance"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <UpdateAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-attendance"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <UpdateAttendance />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
