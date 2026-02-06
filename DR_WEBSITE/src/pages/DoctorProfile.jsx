import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage.service';
import { authService } from '../services/auth.service';
import { useAppContext } from '../context/AppContext';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAppContext();

  const [doctor, setDoctor] = useState(() =>
    storageService.getDoctor()
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    storageService.saveDoctor(doctor);
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Doctor Profile
      </h1>

      <div className="bg-white rounded-lg shadow p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">
                {doctor.specialty}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>

            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: 'Full Name', key: 'name' },
            { label: 'License Number', key: 'license' },
            { label: 'Specialty', key: 'specialty' },
            { label: 'Email', key: 'email' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {isEditing ? (
                <input
                  value={doctor[field.key] || ''}
                  onChange={(e) =>
                    setDoctor({
                      ...doctor,
                      [field.key]: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-md">
                  {doctor[field.key] || '—'}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;