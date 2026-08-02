# DevTinder - Full Project Documentation

Welcome to **DevTinder**, a Tinder-like networking application designed specifically for software developers. Instead of matches based on generic info, matches are curated based on technology stacks, experience, and mutual networks. 

This document serves as the comprehensive technical guide for the entire **DevTinder** project.

---

## 📂 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Directory Structure](#3-directory-structure)
4. [Data Models & Schema Design](#4-data-models--schema-design)
5. [REST API Endpoint Directory](#5-rest-api-endpoint-directory)
6. [Data Structures & Algorithms (DSA) Integrations](#6-data-structures--algorithms-dsa-integrations)
7. [Observability & Supporting Services](#7-observability--supporting-services)
8. [Frontend Client & Redux Store](#8-frontend-client--redux-store)
18. [Utilities & Scripts](#9-utilities--scripts)
19. [Local Development Setup](#10-local-development-setup)
11. [Interview Architecture Breakdown (What, How, Why)](#11-interview-architecture-breakdown-what-how-why)

---

## 1. Project Overview
DevTinder connects developers who share common skills, coding interest, and professional circles. It provides swiping features ("Interested" or "Ignore"), connection requests reviews ("Accepted" or "Rejected"), and background digest systems. It also showcases strong CS fundamentals by integrating custom in-memory data structures (like Max-Heaps, Graphs, and LRU caches) directly into standard REST API endpoints.

---

## 2. Tech Stack & Dependencies

### 🟢 Backend (Node.js & Express)
* **Core:** Express.js for the HTTP REST API.
* **Database:** MongoDB Atlas managed via Mongoose ODM.
* **Authentication:** JWT (JSON Web Tokens) saved in HTTP-only cookies, combined with BCrypt password hashing.
* **Notifications:** Nodemailer (SMTP service) for transaction alerts (connection requests, accepted connections, password reset).
* **Scheduling:** `node-cron` for daily digests.

### 🔵 Frontend (React & Vite)
* **Build Tool:** Vite.
* **CSS Framework:** Tailwind CSS v4 combined with DaisyUI v5.
* **State Management:** Redux Toolkit (`@reduxjs/toolkit` and `react-redux`).
* **Routing:** React Router v7.
* **Network Requests:** Axios with cookies credentials enabled.

---

## 3. Directory Structure

```text
DevTinder/
│
├── DevTinderFrontend/          # React Client application
│   ├── src/
│   │   ├── assets/             # Images & static graphics
│   │   ├── components/         # React UI Components (Feed, Login, Connections, Admin, etc.)
│   │   ├── utils/              # Redux slices, appStore, and axios configuration
│   │   ├── App.jsx             # Main router configuration
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # React root DOM entrypoint
│   ├── package.json
│   └── vite.config.js
│
├── src/                        # Express Backend application
│   ├── config/
│   │   ├── .env                # Secret environment variables (DB URI, SMTP secrets)
│   │   └── database.js         # MongoDB connection script
│   ├── middlewares/
│   │   ├── auth.js             # User authentication gatekeeper middleware
│   │   └── adminAuth.js        # Admin authorization gatekeeper middleware
│   ├── models/
│   │   ├── adminSettings.js    # Global application/notification configurations
│   │   ├── connectionRequest.js# Social graph edge schema
│   │   └── user.js             # User profile schema
│   ├── routes/
│   │   ├── admin.js            # Admin panel settings endpoints
│   │   ├── auth.js             # Sign up, Login, Logout, and Forgot/Reset password
│   │   ├── profile.js          # Profile view (cached) and update endpoints
│   │   ├── requests.js         # Connection requests sending and reviewing
│   │   └── user.js             # Feed scoring, Connections list, and Mutual connections
│   ├── utils/
│   │   ├── cronJob.js          # Daily digests node-cron background task
│   │   ├── emailService.js     # SMTP transport templates
│   │   ├── LRUCache.js         # Custom Least Recently Used profile cache
│   │   ├── PriorityQueue.js    # Custom Max-Heap helper class
│   │   └── validation.js       # Sanitizer for signup & edit profiles
│   └── app.js                  # Main server entrypoint
│
├── seedUsers.js                # Inserts 30 developer profiles into Database
├── createAdmin.js              # Command Line interface to create or escalate Admin accounts
└── package.json
```

---

## 4. Data Models & Schema Design

### 👤 User Model ([user.js](file:///c:/Users/RRP/Downloads/DevTinder/src/models/user.js))
Represents a developer account profile:
* `firstName` (String, required, minLength: 4, maxLength: 50)
* `lastName` (String)
* `emailId` (String, unique, lowercase, validated using validator.js)
* `password` (String, required)
* `age` (Number, min: 18)
* `gender` (String, enum: `["male", "female", "others"]`)
* `isPremium` (Boolean, default: false)
* `photoUrl` (String, default: default profile placeholder)
* `about` (String, default: "This is default about...")
* `skills` (Array of Strings, limited to max 10 skills)
* `isAdmin` (Boolean, default: false)
* `passwordResetToken` / `passwordResetExpires` (Strings/Dates for secure password retrieval)

### 🔗 ConnectionRequest Model ([connectionRequest.js](file:///c:/Users/RRP/Downloads/DevTinder/src/models/connectionRequest.js))
Models connection lines between two developers:
* `fromUserId` (ObjectId, ref: `UserDevTinder`, indexes: 1)
* `toUserId` (ObjectId, ref: `UserDevTinder`, indexes: 1)
* `status` (String, enum: `["pending", "accepted", "rejected", "interested"]`)
* **Constraints:** Compound index `{ fromUserId: 1, toUserId: 1 }` prevents duplicates. A schema `pre-save` hook validates that developers cannot connect with themselves.

### ⚙️ AdminSettings Model ([adminSettings.js](file:///c:/Users/RRP/Downloads/DevTinder/src/models/adminSettings.js))
Enables real-time global environment overrides:
* `emailEnabled` (Boolean, default: true)
* `dailyDigestEnabled` (Boolean, default: true)
* `connectionNotificationsEnabled` (Boolean, default: true)

---

## 5. REST API Endpoint Directory

### 🔑 Authentication Routes ([auth.js](file:///c:/Users/RRP/Downloads/DevTinder/src/routes/auth.js))
* `POST /api/signup` — Registers a new user. Performs validation, hashes passwords via bcrypt, returns user data, and places a JWT auth token in cookies.
* `POST /api/login` — Verifies email/password and returns a JWT auth cookie.
* `POST /api/logout` — Evicts cookies and logouts.
* `POST /api/forgot-password` — Generates a secure reset token and emails a link.
* `POST /api/reset-password/:token` — Validates the token and updates the user's password.

### 👤 Profile Routes ([profile.js](file:///c:/Users/RRP/Downloads/DevTinder/src/routes/profile.js))
* `GET /api/profile/view` — Fetch details of the currently logged-in user.
* `GET /api/profile/view/:userId` — Fetch a developer's public profile card (Optimized via custom LRU Cache).
* `PATCH /api/profile/update` — Validate and update user profile attributes.

### ✉️ Connection Request Routes ([requests.js](file:///c:/Users/RRP/Downloads/DevTinder/src/routes/requests.js))
* `POST /api/request/send/:status/:toUserId` — Send connection request. Status can be `interested` (like/swipe right) or `ignore` (dislike/swipe left). Triggers instant SMTP notification emails.
* `POST /api/request/review/:status/:requestId` — Review incoming connection request. Status can be `accepted` or `rejected`. Triggers SMTP email alerts to the sender upon acceptance.

### 🌐 User Operations Routes ([user.js](file:///c:/Users/RRP/Downloads/DevTinder/src/routes/user.js))
* `GET /api/user/feed` — Fetches standard feed recomendations, prioritized by custom compatibility algorithms.
* `GET /api/user/Allconnections` — Returns names, skills, and bio data for all active matches.
* `GET /api/user/connections/recived` — Fetch all pending inbound connection requests.
* `GET /api/user/mutual-connections` — Find 2nd-degree suggested network profiles.

---

## 6. Data Structures & Algorithms (DSA) Integrations

This project implements three premium features to demonstrate strong CS fundamentals directly in web systems.

### 🥇 1. Max-Heap / Priority Queue Matchmaker ([PriorityQueue.js](file:///c:/Users/RRP/Downloads/DevTinder/src/utils/PriorityQueue.js))
* **Algorithm:** When pulling recommended developer feeds in `/api/user/feed`, the backend computes compatibility scores. The score awards `+10` points for every matching skill, plus a `+5` boost for premium accounts.
* **DSA Implementation:** Instead of sorting the entire database collection in memory ($O(N \log N)$), candidate developers are enqueued into a custom **Binary Max-Heap**. By popping from the heap, we extract the top recommendations in optimal $O(N \log K)$ pagination bounds.

### 🥈 2. BFS Social Network Graphs ([user.js](file:///c:/Users/RRP/Downloads/DevTinder/src/routes/user.js#L10-L71))
* **Algorithm:** Social relationships are modeled as an undirected graph. Direct matches are 1st-degree connections.
* **DSA Implementation:** To recommend new programmers ("People You May Know"), the `/api/user/mutual-connections` route runs a **Breadth-First Search (BFS)** traversal up to 2 degrees of separation. It filters out current connections and returns the list of 2nd-degree profiles along with the names of the overlapping mutual friends connecting you.

### 🥉 3. Custom LRU Cache ([LRUCache.js](file:///c:/Users/RRP/Downloads/DevTinder/src/utils/LRUCache.js))
* **Algorithm:** Reading popular public profile cards frequently places high loads on databases.
* **DSA Implementation:** Public views `/api/profile/view/:userId` consult an in-memory **Least Recently Used (LRU) Cache** with a size capacity of `100`. It utilizes a **HashMap** for fast $O(1)$ lookups and a **Doubly Linked List** (with dummy head/tail nodes) for $O(1)$ node eviction and reordering upon updates.

---

## 7. Observability & Supporting Services

### ⏰ Cron Daily Digest ([cronJob.js](file:///c:/Users/RRP/Downloads/DevTinder/src/utils/cronJob.js))
A background daemon runs every morning at **9:00 AM** using `node-cron`. It searches for:
1. Pending inbound connection requests.
2. New accepted matches recorded within the last 24 hours.
If active summaries exist, it formats and dispatches a compiled **Daily Digest Email** summarizing the state of their dashboard.

### 📧 SMTP Email Service ([emailService.js](file:///c:/Users/RRP/Downloads/DevTinder/src/utils/emailService.js))
Nodemailer sends transactional email templates using the parameters defined in the environment variables. Alerts automatically verify active settings toggles in `AdminSettings`.

---

## 8. Frontend Client & Redux Store

The React application is modularly structured, leveraging **Tailwind v4** and **DaisyUI v5** for styling.

### 🧩 Redux Store Configuration ([appStore.js](file:///c:/Users/RRP/Downloads/DevTinder/DevTinderFrontend/src/utils/appStore.js))
Manages global app states:
* `user`: Stores the profile data of the logged-in user.
* `feed`: Manages the feed recommendation stack.
* `connections`: Stores array lists of verified matches.
* `requests`: Incoming pending requests list.

### 🖼️ Core Views
* **Feed** (`Feed.jsx`): Displays recommended developer cards one-by-one. Swiping triggers right/left requests.
* **Connections** (`Connections.jsx`): Shows active connection list. Also features the **People You May Know** container displaying mutual friend info and single-click connection buttons.
* **Auth Forms** (`Login.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`): Interactive states with secure form validations.
* **Admin** (`Admin.jsx`): Controls toggle switches to enable/disable transactional emails and daily digest schedules.

---

## 9. Utilities & Scripts

* **`seedUsers.js`:** Connects to the database and generates 30 developers with randomized skill arrays selected from standard frontend/backend libraries, age limits, and bio details. Run this to test feed scoring features.
* **`createAdmin.js`:** A interactive terminal CLI script using readline. Prompts for admin profile info, encrypts passwords, and writes/upgrades the account as `isAdmin: true` in the DB.

---

## 10. Local Development Setup

To boot both servers locally:

### 1. Set Environment Variables
Create a file at `src/config/.env` on the backend with:
```env
DB_CONNECTION_SECRET=<your_mongodb_atlas_uri>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email@gmail.com>
SMTP_PASS=<your_gmail_app_password>
EMAIL_FROM=DevTinder <your_email@gmail.com>
FRONTEND_URL=http://localhost:5173
```

### 2. Boot Backend Server
```bash
# Install root package dependencies
npm install

# Optional: Seed the database with users
node seedUsers.js

# Start server in development mode (using nodemon)
npm run dev
```
The server will start listening at `http://localhost:7777`.

### 3. Boot Frontend Client
```bash
# Navigate to the frontend directory
cd DevTinderFrontend

# Install dependencies
npm install

# Start Vite client dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 11. Interview Architecture Breakdown (What, How, Why)

This section provides a highly structured breakdown of the entire DevTinder project. It is specifically designed to help you explain the project during technical interviews by covering **What** was built, **How** it was implemented, and **Why** specific engineering choices were made.

### 1. The Frontend Architecture (Client-Side)
**What it is:** A Single Page Application (SPA) where users can view profiles, swipe, manage connections, and update their profiles without the page reloading.
*   **HOW:** Built using **React.js** (bootstrapped with **Vite** for fast builds). We use **React Router** for navigation and **Redux Toolkit** for global state management. The UI is styled using **Tailwind CSS v4** combined with **DaisyUI** to achieve a premium, glassmorphic dark-mode design.
*   **WHY:** 
    *   *Why React?* It allows us to build complex, interactive UI components (like swipeable cards) that update efficiently using the Virtual DOM.
    *   *Why Redux Toolkit?* Data like user profiles, connection requests, and the feed are needed across multiple disparate components. Passing props down deeply (prop-drilling) would be unmanageable.
    *   *Why Tailwind/DaisyUI?* Writing custom CSS for responsive design takes too long and is hard to scale. Tailwind utility classes allow rapid UI prototyping, while DaisyUI provides beautiful, accessible pre-built components (like Cards, Navbars, and Alerts).

### 2. The Backend Architecture (Server-Side)
**What it is:** A RESTful API server that handles all business logic, database queries, and data validation before sending JSON back to the frontend.
*   **HOW:** Built with **Node.js** and the **Express.js** framework. The routing is modularized (e.g., `/api/auth`, `/api/profile`, `/api/request`).
*   **WHY:** 
    *   *Why Node.js/Express?* Since the frontend is in JavaScript (React), using Node.js allows us to use the same language across the entire stack (Full-Stack JS). Express is lightweight and makes defining API endpoints incredibly easy.
    *   *Why a REST API?* It heavily decouples the frontend from the backend. The backend just serves raw data (JSON), meaning you could easily build a mobile app (React Native/Flutter) later that consumes the exact same API without rewriting backend logic.

### 3. The Database Layer
**What it is:** A NoSQL database storing user profiles, credentials, and the complex web of connection requests.
*   **HOW:** We use **MongoDB** as the database and **Mongoose** as an Object Data Modeling (ODM) library in Node.js. We defined rigid Mongoose Schemas with built-in validation.
*   **WHY:** 
    *   *Why MongoDB?* User profiles in DevTinder have flexible, unstructured data (e.g., some users have 2 skills, some have 20; bios vary in length). A NoSQL document database like MongoDB is perfect for this.
    *   *Why Mongoose?* MongoDB is almost *too* flexible (it allows you to save anything). Mongoose adds a strict schema layer so we can enforce required fields, default values, and index data for faster querying (like indexing the `emailId` so logins are fast).

### 4. Authentication & Security
**What it is:** The system that securely logs users in and verifies their identity on every API request.
*   **HOW:** 
    1. Passwords are never saved in plain text; they are hashed using **bcrypt** before hitting the database. 
    2. Upon login, the server generates a **JSON Web Token (JWT)** containing a signed user ID. 
    3. Crucially, this JWT is sent back to the browser via an **HTTP-only Cookie**.
*   **WHY:** 
    *   *Why bcrypt?* If the database is hacked, the attackers only see random cryptographic hashes, keeping user passwords safe.
    *   *Why HTTP-only Cookies for JWT?* Many beginners store JWTs in `localStorage`. This is a massive security flaw because malicious JavaScript (XSS attacks) can read `localStorage` and steal the token. An HTTP-only cookie cannot be read by JavaScript, making it drastically more secure.

### 5. Advanced Engineering & Algorithms
**What it is:** The complex logic that makes the app smart, performant, and engaging.
*   **HOW & WHY:**
    *   **Graph Traversal (BFS):** 
        *   *What/How:* We implemented Breadth-First Search to find "2nd-degree connections" (friends of friends).
        *   *Why:* To power the "People You May Know" feature. Standard SQL joins are terrible at traversing social graphs, but a BFS algorithm can efficiently find mutual connections to recommend.
    *   **Data Caching (LRU Cache):** 
        *   *What/How:* We implemented a Least Recently Used cache (using a Doubly Linked List and Hash Map) for user profiles.
        *   *Why:* If the same popular profile is requested repeatedly, fetching it from the database every time is slow and expensive. Caching keeps the most recently viewed profiles in memory for lightning-fast retrieval.
    *   **Background Processing (Cron Jobs):** 
        *   *What/How:* We use `node-cron` to schedule automated tasks (e.g., running every morning at 9 AM) to send out "Daily Digest" emails.
        *   *Why:* You don't want a user's API request to trigger massive email blasts, as it would cause the app to freeze. Background workers handle heavy, asynchronous tasks without blocking the main web server.
