import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { storageService } from '../services/storage.service';

const SearchPatient = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const patients = storageService.getPatients();

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(term) ||
      patient.id?.includes(term) ||
      patient.contact?.toLowerCase().includes(term)
    );
  });

  const handleSelectPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Search Patients
        </h1>
        <p className="text-gray-600">
          Find patients by name, ID, or contact details
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm
              ? 'No patients found matching your search.'
              : 'No patients registered yet.'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient.id)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {patient.name || 'Unnamed Patient'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {patient.id}
                      {patient.age && ` • Age: ${patient.age}`}
                      {patient.gender && ` • ${patient.gender}`}
                    </p>
                    {patient.contact && (
                      <p className="text-sm text-gray-500">
                        Contact: {patient.contact}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPatient;