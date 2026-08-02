const express = require("express");

const connectionRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const UserDevTinder = require("../models/user");
const { sendConnectionRequestEmail, sendConnectionAcceptedEmail } = require("../utils/emailService");

connectionRouter.post("/profile ", userAuth, async (req, res) => {  
    const user = req.user;
    console.log("Connection Send Successfully");
    res.send(user.firstName + " " + user.lastName + " Connection Send Successfully");
});

//View or Check all Connections Recived
connectionRouter.get("/request/view" , userAuth , async (req , res)=>{
    try{
    const userID=req.user._id;
    const connectionAll = await connectionRequest.findOne({
            toUserId:userID,
            status:"interested"
        });
    if(!connectionAll){
        throw new Error("No Requests are Pending")
    }
        res.send(connectionAll);
    }catch(err){
        res.status(404).send("Error : "+err); 
    }
});

connectionRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

         //Check that the user is existing or not. If the user is not existing then we should not allow the user to send the request.
        const fromUser = await UserDevTinder.findById(fromUserId);
        const toUser = await UserDevTinder.findById(toUserId);
        if (!fromUser || !toUser) {
            throw new Error("User not found.");
        }

        //Same user should not be able to send the request to himself. So we need to check if the fromUserId and toUserId are same or not.
        // if (fromUserId.toString() === toUserId.toString()) {
        //     throw new Error("You cannot send a connection request to yourn hhbself.");

        // }

        //status should be Validated to be interested or ignore as anyone can do Accept or ignore the request. So we need to validate the status before saving it to the database.
        if (!["interested", "ignore"].includes(status)) {
            throw new Error("Invalid status. Please provide either 'interested' or 'ignore'.");
        }

        //If USer A send to User B then User B should not be able to send the request to User A. So we need to check if the request is already sent by the user or not.
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingRequest) {
            if (status === "ignore") {
                return res.send("User ignored successfully");
            }
            throw new Error("Connection request already sent.");
        }


        //New Connection Request is created and saved to the database.
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();

        sendConnectionRequestEmail(toUser.emailId, toUser.firstName, fromUser).catch((err) =>
          console.error("Failed to send connection request email:", err.message)
        );

        res.send(`Connection request sent successfully from ${fromUser.firstName} ${fromUser.lastName} to user with ID: ${toUserId}`);
      
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

connectionRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        //Validate the status to be either accepted or rejected. As anyone can do Accept or reject the request. So we need to validate the status before saving it to the database.
        const requestId=req.params.requestId;
        const status = req.params.status;
        const userLoggedIn=req.user._id;
        const allowedStatus=["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status. Please provide either 'accepted' or 'rejected'.");
        }

        const connectionAllowed =await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:userLoggedIn,
            status:"interested" 
        });

        if(!connectionAllowed){
            return res.status(400).json({message : "Connection Request not Found"});
        }

        connectionAllowed.status=status;

        connectionAllowed.save();

        if (status === "accepted") {
          const fromUser = await UserDevTinder.findById(connectionAllowed.fromUserId);
          const toUser = await UserDevTinder.findById(connectionAllowed.toUserId);
          if (fromUser && toUser) {
            sendConnectionAcceptedEmail(fromUser.emailId, fromUser.firstName, toUser).catch((err) =>
              console.error("Failed to send connection accepted email:", err.message)
            );
          }
        }

        res.json({
            message:"Connection Request "+status
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports = connectionRouter;