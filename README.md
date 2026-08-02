<div align="center">
  <img src="Frontend/src/assets/react.svg" alt="DevTinder Logo" width="100"/>
  <h1>🔥 DevTinder</h1>
  <p><strong>A Tinder-like social networking platform designed exclusively for Software Developers.</strong></p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 🚀 Overview
DevTinder connects developers who share common tech stacks, coding interests, and professional circles. Unlike traditional dating apps based on appearance, matches here are curated based on technology skills and mutual networks to help you find your next co-founder, coding buddy, or mentor.

## ✨ Key Features
* **Swipe-to-Match:** Intuitive interface to "Ignore" or show "Interest" in other developers.
* **Mutual Connections (People You May Know):** Suggests 2nd-degree network connections using Graph Traversal algorithms.
* **Premium Glassmorphic UI:** A state-of-the-art dark mode design built with Tailwind CSS v4 and DaisyUI.
* **Secure Authentication:** Enterprise-grade security utilizing HTTP-only cookies and JWTs.
* **Automated Daily Digests:** Background workers send out morning summaries of new connection requests via email.

## 🧠 Advanced Engineering (DSA Integration)
This isn't just a basic CRUD app. DevTinder utilizes real-world Data Structures and Algorithms to optimize performance and recommendations:
1. **Breadth-First Search (BFS):** Navigates the social graph to find mutual friends.
2. **Binary Max-Heaps:** Prioritizes and paginates feed recommendations based on matching tech stacks.
3. **LRU Cache (Doubly Linked List + HashMap):** Caches popular profile views in-memory to drastically reduce database load.

## 📂 Project Structure
This repository is cleanly separated into a full-stack monorepo:
* `/Backend`: Node.js, Express, and MongoDB REST API.
* `/Frontend`: React, Vite, and Redux Toolkit SPA.

## 📚 Extensive Documentation
Want to know exactly how this was built or prepare for technical interviews? Check out the deep-dive docs:
* [📖 Full Project Architecture Documentation](PROJECT_DOCUMENTATION.md)
* [💻 Interview Preparation & DSA Guide](INTERVIEW_PREP_DSA.md)

---

## 🛠️ Local Development Setup

To run this project locally, you will need to open **two** terminal windows.

### 1. Start the Backend
```bash
cd Backend
npm install
# Ensure you have your .env file configured (see PROJECT_DOCUMENTATION.md)
npm run dev
```

### 2. Start the Frontend
```bash
cd Frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to start swiping!

---
*Built with ❤️ by Rohit*
