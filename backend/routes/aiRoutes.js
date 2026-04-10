const express = require("express");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

// ==========================
// AI PREDICT ROUTE
// ==========================
router.post("/ai/predict", async (req, res) => {
  try {
    console.log("🔥 AI ROUTE HIT");

    // ❌ No image
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        error: "Image file is required",
      });
    }

    const imageFile = req.files.image;

    // Prepare form data for Flask
    const formData = new FormData();
    formData.append("image", imageFile.data, {
      filename: imageFile.name || "image.png",
      contentType: imageFile.mimetype,
    });

    // Call Flask server
    const flaskRes = await axios.post(
      "http://localhost:5002/api/ai/predict",
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    // Send response back to frontend
    return res.json(flaskRes.data);

  } catch (err) {
    console.error("❌ AI ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: "AI service failed",
      details: err.message,
    });
  }
});

module.exports = router;