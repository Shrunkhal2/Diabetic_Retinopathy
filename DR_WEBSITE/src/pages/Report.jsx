import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, Save, Printer, ArrowLeft } from 'lucide-react';
import { storageService } from '../services/storage.service';
import AIResultCard from '../components/AIResultCard';

const Report = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [report, setReport] = useState({
    findings: '',
    diagnosis: '',
    recommendations: '',
    notes: '',
  });

  // 🔹 Mock AI output (to be replaced by backend inference API)
  const aiRiskScore = 62;

  useEffect(() => {
    const sessions = storageService.getSessions();
    const current = sessions.find((s) => s.id === sessionId);

    if (!current) {
      alert('Session not found');
      navigate('/');
      return;
    }

    setSession(current);
    setReport({
      findings: current.findings || 'No abnormal findings detected.',
      diagnosis: current.diagnosis || 'Pending clinical confirmation',
      recommendations:
        current.recommendations || 'Regular follow-up recommended',
      notes: current.notes || '',
    });
  }, [sessionId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = {
      ...session,
      ...report,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    };

    const sessions = storageService
      .getSessions()
      .map((s) => (s.id === session.id ? updated : s));

    storageService.set('sessions', sessions);
    setSession(updated);
    setIsEditing(false);
    alert('Report saved successfully');
  };

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Eye Examination Report
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit3 size={16} />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save size={16} />
              Save
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Report Card */}
      <div className="bg-white rounded-xl shadow p-8 print:shadow-none">
        {/* Meta */}
        <div className="flex justify-between mb-6 text-sm text-gray-600">
          <div>
            <p>
              <strong>Patient:</strong> {session.patientName}
            </p>
            <p>
              <strong>Patient ID:</strong> {session.patientId}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Date:</strong>{' '}
              {new Date(session.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Session ID:</strong> {session.id}
            </p>
          </div>
        </div>

        {/* Eye Image */}
        <div className="mb-8 text-center">
          <img
            src={session.image}
            alt="Eye Examination"
            className="mx-auto max-h-64 rounded-lg shadow"
          />
        </div>

        {/* ✅ AI RESULT SECTION */}
        <AIResultCard riskScore={aiRiskScore} />

        {/* Clinical Findings */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Clinical Findings
          </h3>
          {isEditing ? (
            <textarea
              name="findings"
              value={report.findings}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              {report.findings}
            </div>
          )}
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Diagnosis
          </h3>
          {isEditing ? (
            <input
              name="diagnosis"
              value={report.diagnosis}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              {report.diagnosis}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Recommendations
          </h3>
          {isEditing ? (
            <textarea
              name="recommendations"
              value={report.recommendations}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              {report.recommendations}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Additional Notes
          </h3>
          {isEditing ? (
            <textarea
              name="notes"
              value={report.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              {report.notes || '—'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t text-right text-sm text-green-600 font-medium">
          Status: {session.status || 'completed'}
        </div>
      </div>
    </div>
  );
};

export default Report;