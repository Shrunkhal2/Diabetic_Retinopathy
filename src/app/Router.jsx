import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SearchPatient from "../pages/SearchPatient";
import Patient from "../pages/Patient";
import Report from "../pages/Report";
import Sessions from "../pages/Sessions";
import DoctorProfile from "../pages/DoctorProfile";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const Router = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRole="doctor" />}>
        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/search" element={<SearchPatient />} />
          <Route path="/patient/:id" element={<Patient />} />
          <Route path="/report/:sessionId" element={<Report />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/profile" element={<DoctorProfile />} />

        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default Router;