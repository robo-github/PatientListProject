const express = require("express");
const axios = require("axios");
const Patient = require("../models/patient");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch patients from database." });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const response = await axios.get(process.env.API_URL, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
    });

    const apiPatients = response.data.result || [];

    for (const item of apiPatients) {
      await Patient.findOneAndUpdate(
        { externalId: item.id },
        {
          externalId: item.id,
          registrationId: item.registration_id || "",
          name: item.patient_name || "",
          gender: item.gender || "",
          age: item.age ? String(item.age) : "",
          mobile: item.mobile_no || "",
          address: item.address || "",
        },
        { upsert: true, new: true },
      );
    }

    res.json({ message: "Patients synced successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to sync patients from external API." });
  }
});

module.exports = router;
