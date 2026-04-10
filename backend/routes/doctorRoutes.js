const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  console.log("🔥 REGISTER ROUTE HIT");   // DEBUG 1
  console.log("Headers:", req.headers);   // DEBUG 2

  try {
    const { name, email, password, hospital, role } = req.body;

    console.log("Body:", req.body);       // DEBUG 3

    if (!name || !email || !password || !hospital || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Doctor.create({
      name,
      email,
      password: hashedPassword,
      hospital,
      role,
    });

    return res.status(201).json({
      message: "Doctor registered successfully",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: doctor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;