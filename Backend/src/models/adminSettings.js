const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    dailyDigestEnabled: {
      type: Boolean,
      default: true,
    },
    connectionNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
