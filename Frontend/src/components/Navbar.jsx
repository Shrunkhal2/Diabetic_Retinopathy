import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, Home, Search, Calendar, User, LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const [isDark, setIsDark] = useDarkMode();

  const handleLogout = () => {
    logout();              // clear state
    navigate("/login");    // SPA navigation (NO reload)
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : isDark
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className={isDark ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b"}>
      <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-7 w-7 text-blue-600" />
          <span className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
            EyeCare Portal
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          <NavLink to="/dashboard" className={linkClass}>
            <Home size={18} /> Home
          </NavLink>

          <NavLink to="/search" className={linkClass}>
            <Search size={18} /> Search
          </NavLink>

          <NavLink to="/sessions" className={linkClass}>
            <Calendar size={18} /> Sessions
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <User size={18} /> Profile
          </NavLink>

          <button
            onClick={() => setIsDark(!isDark)}
            className="px-3 py-2 rounded-lg text-sm opacity-70 hover:opacity-100"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;