const express = require("express");
const router = express.Router();

const Session = require("../models/session");
const { protect } = require("../middleware/authMiddleware");


// ==============================
// CREATE SESSION
// ==============================
router.post("/", protect, async (req, res) => {
  try {
    const { patientId, result, status } = req.body;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required"
      });
    }

    const newSession = new Session({
      patient: patientId,
      doctor: req.user.id,
      result: result || "Pending",
      status: status || "ongoing"
    });

    const savedSession = await newSession.save();

    res.status(201).json(savedSession);

  } catch (error) {
    res.status(500).json({
      message: "Error creating session",
      error: error.message
    });
  }
});


// ==============================
// GET ALL SESSIONS FOR DOCTOR
// ==============================
router.get("/", protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      doctor: req.user.id
    }).populate("patient");

    res.json(sessions);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching sessions",
      error: error.message
    });
  }
});

module.exports = router;
