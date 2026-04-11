const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    result: {
      type: String,
      default: "Pending"
    },
    status: {
      type: String,
      default: "ongoing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
