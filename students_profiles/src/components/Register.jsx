import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
      const response = await axios.post('http://localhost:5000/api/register', data);
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authChange')); // Notify App component
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/attendance'), 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'There was an error registering!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
        <div>
          <label>Username</label>
          <input {...register('username', { required: true })} />
          {errors.username && <span>This field is required</span>}
        </div>
        <div>
          <label>Email</label>
          <input {...register('email', { required: true })} />
          {errors.email && <span>This field is required</span>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>This field is required</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
