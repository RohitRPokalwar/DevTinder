require("dotenv").config({ path: "./src/config/.env" });
const express = require("express");
const connectDB = require("./config/database");
const cors = require('cors')
const http = require("http");
const initalizeSocket = require("./utils/chat").initializeSocket;

require("./utils/cronJob");

const app = express();
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: ["http://localhost:5173", /\.vercel\.app$/],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", adminRouter);

const server = http.createServer(app);

initalizeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established...");
        // Only listen if not running in a serverless environment like Vercel
        if (process.env.NODE_ENV !== 'production') {
            server.listen(7777, () => {
                console.log("Server is successfully listening on port 7777...");
            });
        }
    })
    .catch((err) => {
        console.error("Database cannot be connected!!");
        console.error("Error details:", err.message);
        console.error("Full error:", err);
        process.exit(1);
    });

// Export the Express app for Vercel Serverless Functions
module.exports = app;
