import React from 'react';

const getRiskMeta = (score) => {
  if (score < 30) return { label: 'Low Risk', color: 'green' };
  if (score < 70) return { label: 'Moderate Risk', color: 'yellow' };
  return { label: 'High Risk', color: 'red' };
};

const AIResultCard = ({ riskScore }) => {
  const { label, color } = getRiskMeta(riskScore);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        AI Analysis Result
      </h3>

      {/* Risk Score */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Diabetic Retinopathy Risk</p>
          <p className="text-3xl font-bold">{riskScore}%</p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}
        >
          {label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className={`h-3 rounded-full bg-${color}-500`}
          style={{ width: `${riskScore}%` }}
        />
      </div>

      {/* Heatmap Placeholder */}
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Model Attention (Grad-CAM)
        </p>
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed">
          <span className="text-gray-400 text-sm">
            Heatmap will appear here after model inference
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500">
        ⚠️ AI-assisted output. Final diagnosis must be confirmed by a medical professional.
      </p>
    </div>
  );
};

export default AIResultCard;