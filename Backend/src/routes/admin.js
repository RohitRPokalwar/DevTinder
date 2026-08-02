const express = require("express");
const adminRouter = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const AdminSettings = require("../models/adminSettings");

adminRouter.get("/admin/settings", adminAuth, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

adminRouter.put("/admin/settings", adminAuth, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ message: "Settings updated", settings });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = adminRouter;
