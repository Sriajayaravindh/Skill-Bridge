import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    number: '',
    email: '',
    password: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'number') {
      if (!value) error = 'ID is required';
      else if (!/^\d+$/.test(value)) error = 'ID must be numeric';
    }
    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
    }
    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    if (name === 'role') {
      if (!value) error = 'Please select a role';
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      number: !formData.number ? 'ID is required' : !/^\d+$/.test(formData.number) ? 'ID must be numeric' : '',
      email: !formData.email ? 'Email is required' : !/\S+@\S+\.\S+/.test(formData.email) ? 'Invalid email format' : '',
      password: !formData.password ? 'Password is required' : formData.password.length < 6 ? 'Password must be at least 6 characters' : '',
      role: !formData.role ? 'Please select a role' : '',
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) {
      setSubmitError('Please fix errors to submit');
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }

    try {
      const payload = {
        ...formData,
        role: formData.role.toLowerCase(), 
      };

await axios.post('http://127.0.0.1:5550/api/auth/register', payload, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
      navigate('/login');
    } catch (err) {
      console.error(err);
      setSubmitError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-indigo-200">
      <form onSubmit={handleSubmit} className="bg-indigo-50 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-500">Register</h2>

        <input
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Enter your ID"
          className={`w-full mb-1 px-4 py-2 placeholder-slate-400 text-gray-600 border rounded-md focus:outline-none focus:ring-2 ${
            formErrors.number ? 'border-red-500' : 'border-gray-400 focus:ring-emerald-500'
          }`}
        />
        {formErrors.number && <p className="text-red-400 text-sm mb-3">{formErrors.number}</p>}

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your Email"
          className={`w-full mb-1 px-4 py-2  placeholder-slate-400 text-gray-600 border rounded-md focus:outline-none focus:ring-2 ${
            formErrors.email ? 'border-red-500' : 'border-gray-400 focus:ring-emerald-500'
          }`}
        />
        {formErrors.email && <p className="text-red-500 text-sm mb-3">{formErrors.email}</p>}

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your Password"
          className={`w-full mb-1 px-4 py-2 placeholder-slate-400 text-gray-600  border rounded-md focus:outline-none focus:ring-2 ${
            formErrors.password ? 'border-red-500' : 'border-gray-400 focus:ring-emerald-500'
          }`}
        />
        {formErrors.password && <p className="text-red-500 text-sm mb-3">{formErrors.password}</p>}

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Select Role</p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleChange}
                className="accent-emerald-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Student</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="tutor"
                checked={formData.role === 'tutor'}
                onChange={handleChange}
                className="accent-emerald-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Tutor</span>
            </label>
          </div>
          {formErrors.role && <p className="text-red-500 text-sm mt-2">{formErrors.role}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold transition duration-200 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Submit
        </button>
        {submitError && <p className="text-red-500 text-sm mt-3 text-center">{submitError}</p>}
      </form>
    </div>
  );
};

export default Register;