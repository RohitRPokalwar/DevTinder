const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const UserDevTinder = require("../models/user");
const LRUCache = require("../utils/LRUCache");

// Initialize cache for public profiles
const profileCache = new LRUCache(100);

// View public profile by ID (uses LRU Cache)
profileRouter.get("/profile/view/:userId", userAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Check cache first
        const cachedProfile = profileCache.get(userId);
        if (cachedProfile) {
            console.log("Serving profile from LRU Cache");
            return res.send(cachedProfile);
        }

        // If not in cache, query database
        const user = await UserDevTinder.findById(userId).select("firstName lastName photoUrl about skills isPremium");
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Save to cache
        profileCache.put(userId, user);
        console.log("Serving profile from Database & caching it");
        
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            // return res.status(400).send("Invalid profile data");
            throw new Error("Invalid profile data");
        }
        const userLoggedIn = req.user;

        Object.keys(req.body).forEach((key) => {
            userLoggedIn[key] = req.body[key];
        });

        const updatedUser = await userLoggedIn.save();
        res.send(`Profile updated successfully for ${updatedUser.firstName} ${updatedUser.lastName}`);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;
