const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const bcrypt = require("bcryptjs");

// Get all doctors
router.get("/doctors", protect, adminOnly, async (req, res) => {
  const doctors = await Doctor.find({ role: "doctor" }).select("-password");
  res.json(doctors);
});

// Create new doctor
router.post("/doctors", protect, adminOnly, async (req, res) => {
  const { name, email, password } = req.body;

  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    return res.status(400).json({ message: "Doctor already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    role: "doctor",
  });

  res.status(201).json(doctor);
});

// Delete doctor
router.delete("/doctors/:id", protect, adminOnly, async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor deleted" });
});

module.exports = router;
