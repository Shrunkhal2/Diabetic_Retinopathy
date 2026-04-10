const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const {protect} = require("../middleware/authMiddleware");


// =============================
// CREATE PATIENT (Protected)
// =============================
router.post("/", protect, async (req, res) => {
  try {
    const { name, age, problem } = req.body;

    if (!name || !age || !problem) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const newPatient = new Patient({
      name,
      age,
      problem,
      doctor: req.user.id   // 👈 from JWT token
    });

    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);

  } catch (error) {
    res.status(500).json({
      message: "Error creating patient",
      error: error.message
    });
  }
});


// =============================
// GET ALL PATIENTS OF LOGGED DOCTOR
// =============================
router.get("/", protect, async (req, res) => {
  try {
    const patients = await Patient.find({
      doctor: req.user.id
    });

    res.json(patients);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching patients",
      error: error.message
    });
  }
});


// =============================
// GET PATIENT BY ID
// =============================
router.get("/:id", protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user.id   // 🔐 ensures doctor owns patient
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.json(patient);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching patient",
      error: error.message
    });
  }
});


module.exports = router;
