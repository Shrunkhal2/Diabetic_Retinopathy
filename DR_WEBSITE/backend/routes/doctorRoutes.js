const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
    const { name, email, password, hospital, role } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      hospital,
      role: role || "doctor",
    });

    res.status(201).json({
      message: "User created successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password,hospital, role } = req.body;

    if (!name || !email || !password || !hospital || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      hospital,
      role
    });

    res.status(201).json({
      message: "Doctor registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    const doctor = await Doctor.findOne({ email });

    console.log("Doctor found:", doctor);

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials - no user" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials - wrong password" });
    }

    res.json({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
