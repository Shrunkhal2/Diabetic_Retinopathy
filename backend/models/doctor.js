const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
    },
    role: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
