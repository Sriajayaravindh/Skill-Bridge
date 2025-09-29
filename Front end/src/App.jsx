import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/formValidation/Register';
import Login from './pages/formValidation/Login';
import Home from './pages/Home';
import ProtectRoutes from './components/ProtectRoutes';
import SubmitProject from './pages/student/SubmitProject';
import ViewProject from './pages/tutor/ViewProject';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/student"
          element={
            <ProtectRoutes allowedRoles={['student']}>
              <SubmitProject />
            </ProtectRoutes>
          }
        />
        <Route
          path="/tutor"
          element={
            <ProtectRoutes allowedRoles={['tutor']}>
              <ViewProject />
            </ProtectRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default App;
