import { useState } from "react";
import { predictImage } from "../services/ai.service";

const AIPredict = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const data = await predictImage(image);
      setResult(data);
    } catch (err) {
      console.error("AI ERROR:", err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AI Retinopathy Detection</h2>

      {/* Upload */}
      <input type="file" accept="image/*" onChange={handleChange} />

      {/* Preview */}
      {preview && (
        <img src={preview} alt="preview" className="mt-4 w-64 rounded" />
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Analyze Image"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6">
          <h3 className="font-semibold">Prediction:</h3>
          <p>Label: {result.prediction.label}</p>
          <p>Confidence: {result.prediction.confidence}</p>

          {/* Grad-CAM */}
          <img
            src={`data:image/png;base64,${result.explainability.gradcam_base64}`}
            alt="gradcam"
            className="mt-4 w-64 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default AIPredict;