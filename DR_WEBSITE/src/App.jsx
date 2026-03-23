import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin"; // 👈 ADD THIS
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Profile from "./pages/DoctorProfile";
import Search from "./pages/SearchPatient";
import AdminDashboard from "./pages/AdminDashboard"; // 👈 ADD THIS

import Navbar from "./components/Navbar";


// Layout with Navbar
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
            ? <Navigate to="/dashboard" />
            : <Login />
        }
      />

      {/* Admin Login */}
      <Route
        path="/admin-login"
        element={
          isAuthenticated && user?.role === "admin"
            ? <Navigate to="/admin-dashboard" />
            : <AdminLogin />
        }
      />

      {/* Doctor Protected Routes */}
      <Route
        element={
          isAuthenticated && user?.role === "doctor"
            ? <Layout />
            : <Navigate to="/login" />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          isAuthenticated && user?.role === "admin"
            ? <Layout />
            : <Navigate to="/admin-login" />
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}


export default App;
