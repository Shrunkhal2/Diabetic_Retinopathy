import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Profile from "./pages/DoctorProfile";
import Search from "./pages/SearchPatient";
import Patient from "./pages/Patient";          // ✅ ADD
import Report from "./pages/Report";            // ✅ ADD
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";

// Layout
function Layout() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const { isAuthenticated, user } = useAppContext();

  return (
    <Routes>

      {/* Doctor Login */}
      <Route
        path="/login"
        element={
          isAuthenticated && user?.role === "doctor"
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      {/* Admin Login */}
      <Route
        path="/admin-login"
        element={
          isAuthenticated && user?.role === "admin"
            ? <Navigate to="/admin-dashboard" replace />
            : <AdminLogin />
        }
      />

      {/* Doctor Protected */}
      <Route
        element={
          isAuthenticated && user?.role === "doctor"
            ? <Layout />
            : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />

        {/* ✅ CRITICAL FIX */}
        <Route path="/patient/:id" element={<Patient />} />
        <Route path="/report/:sessionId" element={<Report />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          isAuthenticated && user?.role === "admin"
            ? <Layout />
            : <Navigate to="/admin-login" replace />
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;