import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage.service';
import { Camera } from 'lucide-react';

const Patient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    id,
    name: '',
    age: '',
    gender: '',
    contact: '',
    createdAt: new Date().toISOString()
  });

  const [image, setImage] = useState(null);

  // Load patient if exists
  useEffect(() => {
    const existing = storageService
      .getPatients()
      .find((p) => p.id === id);

    if (existing) {
      setPatient(existing);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!patient.name || !patient.age || !patient.gender) {
      alert('Please fill all required patient details');
      return;
    }

    if (!image) {
      alert('Please upload eye image');
      return;
    }

    // Save patient
    storageService.savePatient(patient);

    // Create session
    const session = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      image,
      createdAt: new Date().toISOString(),
      findings: 'AI analysis pending...',
      status: 'draft'
    };

    storageService.saveSession(session);

    navigate(`/report/${session.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {patient.name ? `Patient: ${patient.name}` : 'New Patient'}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Patient Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Patient Information
          </h2>

          <div className="space-y-4">
            <input
              name="name"
              value={patient.name}
              onChange={handleChange}
              placeholder="Full Name *"
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              name="age"
              type="number"
              value={patient.age}
              onChange={handleChange}
              placeholder="Age *"
              className="w-full px-3 py-2 border rounded-md"
            />

            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Gender *</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              name="contact"
              value={patient.contact}
              onChange={handleChange}
              placeholder="Contact"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Eye Image Upload
          </h2>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {image ? (
              <img
                src={image}
                alt="Eye"
                className="mx-auto max-h-48 rounded"
              />
            ) : (
              <>
                <Camera className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <label className="cursor-pointer text-blue-600">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          <button
            onClick={handleContinue}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Patient;