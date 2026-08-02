const cron = require("node-cron");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { sendDailyDigestEmail } = require("./emailService");

// Runs every day at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Cron: Running daily digest job...");

  try {
    const users = await User.find();

    for (const user of users) {
      const pendingRequests = await ConnectionRequest.countDocuments({
        toUserId: user._id,
        status: "interested",
      });

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const newMatches = await ConnectionRequest.find({
        $or: [{ fromUserId: user._id }, { toUserId: user._id }],
        status: "accepted",
        updatedAt: { $gte: todayStart },
      })
        .populate("fromUserId", "firstName lastName about")
        .populate("toUserId", "firstName lastName about");

      const matchUsers = newMatches
        .map((r) =>
          r.fromUserId._id.toString() === user._id.toString()
            ? r.toUserId
            : r.fromUserId
        )
        .filter(Boolean);

      if (pendingRequests === 0 && matchUsers.length === 0) continue;

      await sendDailyDigestEmail(
        user.emailId,
        user.firstName,
        pendingRequests,
        matchUsers
      );
    }

    console.log("Cron: Daily digest sent to all users");
  } catch (err) {
    console.error("Cron: Daily digest failed:", err.message);
  }
});
