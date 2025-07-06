import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../api'; // Use the centralized axios instance

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/users/login', data);
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authChange'));
      setSuccess('Login successful! Redirecting...');

      const decoded = jwtDecode(response.data.token);
      
      // Redirect after a short delay so the user can see the message
      setTimeout(() => {
        if (decoded.user.role === 'staff') {
          navigate('/dashboard');
        } else {
          navigate('/attendance');
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || 'There was an error logging in!');
      setIsLoading(false); // Stop loading only on error
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
        <div>
          <label>Email</label>
          <input 
            type="email" 
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
