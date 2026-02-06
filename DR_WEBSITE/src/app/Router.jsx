import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SearchPatient from '../pages/SearchPatient';
import Patient from '../pages/Patient';
import Report from '../pages/Report';
import Sessions from '../pages/Sessions';
import DoctorProfile from '../pages/DoctorProfile';

import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/Navbar';

const Router = () => {
  return (
    <BrowserRouter>
      {/* Navbar is shown only on authenticated pages */}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />

          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <SearchPatient />
              </>
            }
          />

          <Route
            path="/patient/:id"
            element={
              <>
                <Navbar />
                <Patient />
              </>
            }
          />

          <Route
            path="/report/:sessionId"
            element={
              <>
                <Navbar />
                <Report />
              </>
            }
          />

          <Route
            path="/sessions"
            element={
              <>
                <Navbar />
                <Sessions />
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <DoctorProfile />
              </>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;