import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
    }
    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }

    setLoginErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: !loginData.email
        ? 'Email is required'
        : !/\S+@\S+\.\S+/.test(loginData.email)
        ? 'Invalid email format'
        : '',
      password: !loginData.password
        ? 'Password is required'
        : loginData.password.length < 6
        ? 'Password must be at least 6 characters'
        : '',
    };

    setLoginErrors(errors);
    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) {
      setSubmitError('Please fix errors to submit');
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:5550/api/auth/login', loginData);
      const { token, role, user } = res.data;

      const normalizedRole = role?.toLowerCase();
      localStorage.setItem('token', token);
      localStorage.setItem('role', normalizedRole);
      localStorage.setItem('email', user.email);

      // console.log('Logged in as:', normalizedRole);

      if (normalizedRole === 'student') navigate('/student');
      else if (normalizedRole === 'tutor') navigate('/tutor');
      else navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
        <div className="flex items-center justify-center min-h-[90vh] bg-indigo-200">
    <form
      onSubmit={handleSubmit}
      className="bg-indigo-50 p-10 rounded-lg shadow-md w-full max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-500">Login</h2>

      <input
        type="email"
        name="email"
        value={loginData.email}
        onChange={handleChange}
        placeholder="Enter your Email"
        className={`w-full mb-1 px-4 py-2  placeholder-slate-400 text-gray-600 border rounded-md focus:outline-none focus:ring-2 ${
          loginErrors.email ? 'border-red-500' : 'border-gray-400 focus:ring-emerald-500'
        }`}
      />
      {loginErrors.email && <p className="text-red-500 text-sm mb-3">{loginErrors.email}</p>}

      <input
        type="password"
        name="password"
        value={loginData.password}
        onChange={handleChange}
        placeholder="Enter your Password"
        className={`w-full mb-1 px-4 py-2 placeholder-slate-400 text-gray-600 border rounded-md focus:outline-none focus:ring-2 ${
          loginErrors.password ? 'border-red-500' : 'border-gray-400 focus:ring-emerald-500'
        }`}
      />
      {loginErrors.password && <p className="text-red-500 text-sm mb-3">{loginErrors.password}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 mt-5 rounded-md font-semibold transition duration-200 text-white ${
          isSubmitting ? 'bg-gray-500' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isSubmitting ? 'Logging in...' : 'Submit'}
      </button>

      {submitError && <p className="text-red-500 text-sm mt-3 text-center">{submitError}</p>}
    </form>
    </div>
  );
};

export default Login;