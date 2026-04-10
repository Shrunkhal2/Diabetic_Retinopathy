const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const fileUpload = require("express-fileupload"); // ✅ ADD

const doctorRoutes = require("./routes/doctorRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const patientRoutes = require("./routes/patientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes"); // ✅ ADD

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ IMPORTANT: file upload middleware
app.use(fileUpload());

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", aiRoutes); // ✅ ADD THIS

app.listen(5001, () => {
  console.log("Server running on port 5001 🚀");
});