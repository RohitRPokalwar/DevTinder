const moongose =require("mongoose");

const connectionRequestSchema = new moongose.Schema({
    fromUserId:{
        type: moongose.Schema.Types.ObjectId,
        ref:"UserDevTinder",
        required: true,
    },
    toUserId:{
        type: moongose.Schema.Types.ObjectId,
        ref:"UserDevTinder",
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["pending", "accepted", "rejected", "interested"],
            message: `{VALUE} is not a valid status`,
        },
    },
},{timestamps: true}
);

//Compound Index as User A to User B can only have one connection request at a time. This will prevent duplicate requests between the same users.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

//Error Handling for the connectionRequestSchema. If the fromUserId and toUserId are same then we should not allow the user to send the request.    

connectionRequestSchema.pre("save", async function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("You cannot send a connection request to yourself."));
    }

    next();
});

module.exports = moongose.model("ConnectionRequest", connectionRequestSchema);
