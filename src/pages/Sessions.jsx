import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText } from 'lucide-react';
import { storageService } from '../services/storage.service';

const Sessions = () => {
  const navigate = useNavigate();
  const sessions = storageService.getSessions();

  const handleViewReport = (sessionId) => {
    navigate(`/report/${sessionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Previous Sessions
        </h1>
        <p className="text-gray-600">
          Review past eye examination sessions and reports
        </p>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No previous sessions found.
          </div>
        ) : (
          <div className="divide-y">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {session.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Session ID: {session.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {session.status || 'draft'}
                  </span>

                  <button
                    onClick={() => handleViewReport(session.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FileText size={16} />
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;