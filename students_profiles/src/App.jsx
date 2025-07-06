import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import Attendance from './components/Attendance';
import StudentManagement from './components/StudentManagement';

import EditStudent from './components/EditStudent';
import ViewProfile from './components/ViewProfile';
import Dashboard from './components/Dashboard';
import UpdateAttendance from './components/UpdateAttendance';
import AddUser from './components/AddUser';
import StaffProfile from './components/StaffProfile';
import ProtectedRoute from './components/ProtectedRoute';

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
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to={isAuthenticated ? (userRole === 'staff' ? '/dashboard' : '/attendance') : '/login'} className="navbar-item">
              Student Records
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              {isAuthenticated ? (
                <>
                  {userRole === 'staff' && (
                    <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                  )}
                   {userRole !== 'staff' && (
                    <Link to="/attendance" className="navbar-item">Attendance</Link>
                  )}
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-item">Login</Link>
                  <Link to="/register" className="navbar-item">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="main-content">
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
              path="/add-user"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <AddUser />
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
                <ProtectedRoute>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/:id"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffProfile />
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
        </main>
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
