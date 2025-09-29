import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
const navigate = useNavigate();
const isLoggedIn = !!localStorage.getItem('token');

const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-slate-100 px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-wide text-indigo-200">Skill Bridge</h2>
        <ul className="flex space-x-6 text-sm font-medium">
          <li><Link to="/" className="hover:text-indigo-200 transition">Home</Link></li>
          {!isLoggedIn && (
            <>
              <li><Link to="/register" className="hover:text-indigo-200 transition">Register</Link></li>
              <li><Link to="/login" className="hover:text-indigo-200 transition">Login</Link></li>
            </>
          )}

          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100 transition"
              >
                Logout
              </button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;