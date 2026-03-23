import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Users,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react";
import { storageService } from "../services/storage.service";
import { authService } from "../services/auth.service";


// 🔹 Reusable Stat Card Component
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`p-6 rounded-lg ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon className="h-10 w-10 opacity-80" />
    </div>
  </div>
);


// 🔹 Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();

  const patients = storageService.getPatients();
  const sessions = storageService.getSessions();

  const todaySessions = sessions.filter(
    (s) =>
      new Date(s.createdAt).toDateString() ===
      new Date().toDateString()
  ).length;

  const handleNewPatient = () => {
    const id = Date.now().toString();
    navigate(`/patient/${id}`);
  };



  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to EyeCare Portal
          </h1>
          <p className="text-gray-600">
            Manage patients and eye examination records
          </p>
        </div>

        
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <button
          onClick={() => navigate("/search")}
          className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition text-left"
        >
          <Search className="h-10 w-10 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Existing Patient
          </h2>
          <p className="text-gray-600">
            Search and manage existing patient records
          </p>
        </button>

        <button
          onClick={handleNewPatient}
          className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition text-left"
        >
          <UserPlus className="h-10 w-10 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            New Patient
          </h2>
          <p className="text-gray-600">
            Register a new patient and start examination
          </p>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Patients"
          value={patients.length}
          color="bg-blue-50 text-blue-800"
        />
        <StatCard
          icon={Calendar}
          title="Today's Sessions"
          value={todaySessions}
          color="bg-green-50 text-green-800"
        />
        <StatCard
          icon={FileText}
          title="Total Sessions"
          value={sessions.length}
          color="bg-purple-50 text-purple-800"
        />
        <StatCard
          icon={FileText}
          title="Reports Generated"
          value={sessions.filter((s) => s.status === "completed").length}
          color="bg-orange-50 text-orange-800"
        />
      </div>
    </div>
  );
};

export default Dashboard;
