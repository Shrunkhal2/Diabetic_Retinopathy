const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const doctorRoutes = require("./routes/doctorRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const patientRoutes = require("./routes/patientRoutes");
const adminRoutes = require("./routes/adminRoutes");




const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/doctors", doctorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
