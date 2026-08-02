require("dotenv").config({ path: "./src/config/.env" });
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const User = require("./src/models/user");
const ConnectionRequest = require("./src/models/connectionRequest");
const bcrypt = require("bcrypt");

const createSuperUserAndConnect = async () => {
  try {
    await connectDB();
    console.log("Database connected.");

    const email = "super@devtinder.com";
    let superUser = await User.findOne({ emailId: email });

    if (!superUser) {
      console.log("Creating Super User...");
      const passwordHash = await bcrypt.hash("Super@1234", 10);
      superUser = new User({
        firstName: "Super",
        lastName: "Admin",
        emailId: email,
        password: passwordHash,
        age: 30,
        gender: "male",
        skills: ["System Design", "Leadership", "Architecture", "JavaScript", "React"],
        about: "I am the super user connected to everyone for testing purposes.",
        isPremium: true,
        isAdmin: true
      });
      await superUser.save();
      console.log(`Created Super User with ID: ${superUser._id}`);
    } else {
      console.log(`Super User already exists with ID: ${superUser._id}`);
    }

    // Get all other users
    const allOtherUsers = await User.find({ _id: { $ne: superUser._id } });
    console.log(`Found ${allOtherUsers.length} other users.`);

    // Clear existing requests for the super user to avoid duplicate key errors
    await ConnectionRequest.deleteMany({
      $or: [
        { fromUserId: superUser._id },
        { toUserId: superUser._id }
      ]
    });

    console.log("Cleared old connections for super user.");

    // Create new accepted connections
    const connectionRequests = allOtherUsers.map(user => {
      return {
        fromUserId: user._id,
        toUserId: superUser._id,
        status: "accepted"
      };
    });

    // We use insertMany with ordered: false to skip duplicates if any exist unexpectedly
    if (connectionRequests.length > 0) {
      await ConnectionRequest.insertMany(connectionRequests, { ordered: false });
    }

    console.log(`Successfully connected ${email} to ${connectionRequests.length} users with 'accepted' status.`);
    process.exit(0);

  } catch (err) {
    console.error("Error creating super user connections:", err);
    process.exit(1);
  }
};

createSuperUserAndConnect();
