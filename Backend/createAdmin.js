require("dotenv").config({ path: "./src/config/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/user");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("Connected to MongoDB\n");

    const firstName = await ask("Enter Admin First Name: ");
    const lastName = await ask("Enter Admin Last Name: ");
    const emailId = await ask("Enter Admin Email: ");
    const password = await ask("Enter Admin Password: ");

    if (!firstName || !emailId || !password) {
      console.log("\nFirst Name, Email and Password are required!");
      process.exit(1);
    }

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      existingUser.isAdmin = true;
      await existingUser.save({ validateBeforeSave: false });
      console.log(`\n${existingUser.firstName} is now an Admin!`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        isAdmin: true,
      });
      await admin.save();
      console.log(`\nAdmin "${firstName}" created successfully!`);
    }

    console.log(`Email: ${emailId}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
