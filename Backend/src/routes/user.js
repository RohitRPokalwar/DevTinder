const express=require('express')
const userRouter=express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const UserDevTinder = require("../models/user");
const PriorityQueue = require("../utils/PriorityQueue");

// Mutual Connections / 2nd-degree connections using BFS
userRouter.get("/user/mutual-connections", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id.toString();

        // 1. Get all accepted connections of the logged-in user, populating name info
        const directConnections = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUserId, status: "accepted" },
                { fromUserId: loggedInUserId, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName")
          .populate("toUserId", "firstName lastName");

        const myConnections = new Map(); // userId -> Name
        directConnections.forEach(conn => {
            const from = conn.fromUserId;
            const to = conn.toUserId;
            if (from._id.toString() === loggedInUserId) {
                myConnections.set(to._id.toString(), `${to.firstName} ${to.lastName}`);
            } else {
                myConnections.set(from._id.toString(), `${from.firstName} ${from.lastName}`);
            }
        });

        // 2. Use BFS to find 2nd degree connections
        const visited = new Set(myConnections.keys());
        visited.add(loggedInUserId); // Don't recommend ourselves

        // Assuming we want up to 2nd degree connections (friends of friends)
        const secondDegreeConnections = await connectionRequest.find({
            $and: [
                { status: "accepted" },
                {
                    $or: [
                        { toUserId: { $in: Array.from(myConnections.keys()) } },
                        { fromUserId: { $in: Array.from(myConnections.keys()) } }
                    ]
                }
            ]
        });

        const mutualFriendsMap = new Map(); // suggestedUserId -> Set of mutual friend names

        secondDegreeConnections.forEach(conn => {
            const from = conn.fromUserId.toString();
            const to = conn.toUserId.toString();

            if (myConnections.has(from) && !visited.has(to)) {
                if (!mutualFriendsMap.has(to)) {
                    mutualFriendsMap.set(to, new Set());
                }
                mutualFriendsMap.get(to).add(myConnections.get(from));
            } else if (myConnections.has(to) && !visited.has(from)) {
                if (!mutualFriendsMap.has(from)) {
                    mutualFriendsMap.set(from, new Set());
                }
                mutualFriendsMap.get(from).add(myConnections.get(to));
            }
        });

        const suggestedUserIds = Array.from(mutualFriendsMap.keys());

        const suggestedUsers = await UserDevTinder.find({
            _id: { $in: suggestedUserIds }
        }).select("firstName lastName photoUrl about skills isPremium");

        const responseData = suggestedUsers.map(user => {
            const userObj = user.toObject();
            userObj.mutualConnections = Array.from(mutualFriendsMap.get(user._id.toString()) || []);
            return userObj;
        });

        res.send(responseData);

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

//Check the all Connections
userRouter.get("/user/Allconnections" , userAuth , async (req , res)=>{
    try{
    const userID=req.user._id;
    const connectionAll = await connectionRequest.find({
           $or:[
            {toUserId:userID , status:"accepted"},
            {fromUserId:userID , status:"accepted"}
           ],
        })        .populate("fromUserId" , ["firstName"  , "lastName" , "emailId" , "photoUrl" , "about" , "skills" , "isPremium"])
            .populate("toUserId" , ["firstName"  , "lastName" , "emailId" , "photoUrl" , "about" , "skills" , "isPremium"]);

    if(connectionAll.length==0){
        throw new Error("No Requests are Pending")
    }
    // const Details=await UserDevTinder.find({
    //         _id:connectionAll.fromUserId
    //     });

    //It is Correct for who Accepted 
    //When that Accepted guy goes they will see there own so we need to pass row.toUserId that


    // const data =connectionAll.map((row)=> row.fromUserId);

    const data=connectionAll.map((row)=>{
        if(row.fromUserId._id.toString()===userID.toString()){
           return row.toUserId;
        }
        return row.fromUserId;
    });
        res.send(data);
    }catch(err){
        res.status(404).send("Error : "+err); 
    }
});


//View or Check all Connections Recived
userRouter.get("/user/connections/recived" , userAuth , async (req , res)=>{
    try{
    const userID=req.user._id;
    const connectionAll = await connectionRequest.find({
            toUserId:userID,
            status:"interested"
        }).populate("fromUserId" , ["firstName"  , "lastName" , "photoUrl" , "about" , "skills"]);
    if(connectionAll.length==0){
        throw new Error("No Requests are Pending")
    }
        res.send(connectionAll);
    }catch(err){
        res.status(404).send("Error : "+err); 
    }
});

userRouter.get("/user/feed" , userAuth , async (req , res)=>{
    try{

        const loggedInUser=req.user;
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;


        const skip=(page-1)*limit;

        //find all Connections (sent+recived)
        const ConnectionRequests=await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id} ,{toUserId:loggedInUser._id}
            ]
        }).select("fromUserId  toUserId");

        const hideUsers=new Set();

        ConnectionRequests.forEach(req => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        });

        const users=await UserDevTinder.find({
            $and:[
                {_id : {$nin:Array.from(hideUsers)}},
                {_id : {$ne:loggedInUser._id}},
            ],
        }).select("firstName lastName emailId isPremium photoUrl skills about");

        // Scoring algorithm: 10 points for every matching skill
        const calculateScore = (user1, user2) => {
            let score = 0;
            const user1Skills = new Set((user1.skills || []).map(s => s.toLowerCase()));
            const user2Skills = (user2.skills || []).map(s => s.toLowerCase());
            
            user2Skills.forEach(skill => {
                if(user1Skills.has(skill)) score += 10; // High weight for matching skill
            });
            if (user2.isPremium) score += 5; // Slight boost for premium users
            
            return score;
        };

        // Priority Queue (Max-Heap) based on compatibility score
        const pq = new PriorityQueue((a, b) => a.score > b.score);

        users.forEach(user => {
            const score = calculateScore(loggedInUser, user);
            pq.enqueue({ user, score });
        });

        // Extract elements sorted by score
        const sortedUsers = [];
        while(!pq.isEmpty()) {
            sortedUsers.push(pq.dequeue().user);
        }

        // Paginate manually since we retrieved all eligible to rank them properly
        const paginatedUsers = sortedUsers.slice(skip, skip + limit);

        res.send(paginatedUsers);
    }catch(err){
        res.status(400).send("ERROR : "+err);
    }
});
module.exports=userRouter;

