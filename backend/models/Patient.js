const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    externalId: {
      type: Number,
      required: true,
      unique: true,
    },
    registrationId: { type: String, default: "" },
    name: { type: String, default: "" },
    gender: { type: String, default: "" },
    age: { type: String, default: "" },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Patient", patientSchema);
