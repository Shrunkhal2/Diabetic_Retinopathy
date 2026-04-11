import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, Save, Printer, ArrowLeft } from "lucide-react";
import { storageService } from "../services/storage.service";
import api from "../services/api"; // ✅ CORRECT API

const Report = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [report, setReport] = useState({
    findings: "",
    diagnosis: "",
    recommendations: "",
    notes: "",
  });

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const sessions = storageService.getSessions();
    const current = sessions.find((s) => s.id === sessionId);

    if (!current) {
      alert("Session not found");
      navigate("/");
      return;
    }

    setSession(current);

    setReport({
      findings: current.findings || "No abnormal findings detected.",
      diagnosis: current.diagnosis || "Pending clinical confirmation",
      recommendations:
        current.recommendations || "Regular follow-up recommended",
      notes: current.notes || "",
    });

    if (current.aiResult) {
      setAiResult(current.aiResult);
    } else {
      runAIInference(current);
    }
  }, [sessionId, navigate]);

  // ============================
  // ✅ FIXED AI CALL (NODE → FLASK)
  // ============================
  const runAIInference = async (currentSession) => {
    try {
      setAiLoading(true);
      setAiError(null);

      const imageBlob = await fetch(currentSession.image).then((r) =>
        r.blob()
      );

      const formData = new FormData();
      formData.append("image", imageBlob);

      const res = await api.post("/ai/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.error || "AI inference failed");
      }

      const aiPayload = {
        label: data.prediction.label,
        confidence: data.prediction.confidence,
        heatmap: data.explainability.gradcam_base64,
      };

      // Save locally
      const updatedSessions = storageService.getSessions().map((s) =>
        s.id === currentSession.id
          ? { ...s, aiResult: aiPayload }
          : s
      );

      storageService.set("sessions", updatedSessions);
      setAiResult(aiPayload);

      // Auto-fill report
      setReport((prev) => ({
        ...prev,
        diagnosis:
          prev.diagnosis === "Pending clinical confirmation"
            ? aiPayload.label.replace("_", " ")
            : prev.diagnosis,
        findings:
          prev.findings === "No abnormal findings detected."
            ? `AI suggests ${aiPayload.label.replace(
                "_",
                " "
              )} diabetic retinopathy`
            : prev.findings,
      }));

    } catch (err) {
      console.error("AI ERROR:", err);
      setAiResult(null);
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = {
      ...session,
      ...report,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };

    const sessions = storageService
      .getSessions()
      .map((s) => (s.id === session.id ? updated : s));

    storageService.set("sessions", sessions);
    setSession(updated);
    setIsEditing(false);
    alert("Report saved successfully");
  };

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">
            Eye Examination Report
          </h1>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setIsEditing(!isEditing)}>
            <Edit3 size={16} /> {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button onClick={handleSave}>
              <Save size={16} /> Save
            </button>
          )}

          <button onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-xl shadow p-8">
        <img
          src={session.image}
          alt="Eye"
          className="mx-auto max-h-64 mb-6 rounded"
        />

        {/* AI Section */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">AI Analysis</h3>

          {aiLoading && <p>Running AI...</p>}
          {aiError && <p className="text-red-500">{aiError}</p>}

          {aiResult && (
            <div>
              <p className="text-xl font-bold">
                {aiResult.label.replace("_", " ")}
              </p>
              <p>
                Confidence: {(aiResult.confidence * 100).toFixed(2)}%
              </p>

              <img
                src={`data:image/png;base64,${aiResult.heatmap}`}
                alt="GradCAM"
                className="mt-4 w-64"
              />
            </div>
          )}
        </div>

        <Section
          title="Findings"
          editing={isEditing}
          value={report.findings}
          name="findings"
          onChange={handleChange}
        />

        <Section
          title="Diagnosis"
          editing={isEditing}
          value={report.diagnosis}
          name="diagnosis"
          onChange={handleChange}
          input
        />

        <Section
          title="Recommendations"
          editing={isEditing}
          value={report.recommendations}
          name="recommendations"
          onChange={handleChange}
        />

        <Section
          title="Notes"
          editing={isEditing}
          value={report.notes}
          name="notes"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

const Section = ({ title, editing, value, name, onChange, input }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">{title}</h3>
    {editing ? (
      input ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border px-3 py-2"
        />
      ) : (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border px-3 py-2"
        />
      )
    ) : (
      <div className="bg-gray-100 p-4">{value}</div>
    )}
  </div>
);

export default Report;