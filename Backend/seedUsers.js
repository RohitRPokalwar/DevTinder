require("dotenv").config({ path: "./src/config/.env" });
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const UserDevTinder = require("./src/models/user");
const bcrypt = require("bcrypt");

const skillsList = ["JavaScript", "React", "Node.js", "Python", "Java", "C++", "MongoDB", "SQL", "Docker", "AWS", "TypeScript", "Express"];
const firstNames = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Nina", "Oscar", "Peggy", "Romeo", "Sybil", "Trent", "Victor", "Walter", "Zoe", "Liam", "Emma", "Noah", "Olivia", "William", "Sophia", "James", "Isabella", "Oliver", "Mia"];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("Database connected. Starting seed...");

    const passwordHash = await bcrypt.hash("Test@1234", 10);
    const usersToInsert = [];

    for (let i = 0; i < 30; i++) {
      // Pick 3 random skills
      const shuffledSkills = skillsList.sort(() => 0.5 - Math.random());
      const userSkills = shuffledSkills.slice(0, 3);
      
      const firstName = firstNames[i % firstNames.length] + i;
      const emailId = `${firstName.toLowerCase()}@example.com`;

      usersToInsert.push({
        firstName: firstName,
        lastName: "Developer",
        emailId: emailId,
        password: passwordHash,
        age: 20 + (i % 20),
        gender: i % 2 === 0 ? "male" : "female",
        skills: userSkills,
        about: `Hi, I am ${firstName} and I love coding!`,
        isPremium: i % 5 === 0 
      });
    }

    await UserDevTinder.insertMany(usersToInsert);
    console.log("30 Users inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
