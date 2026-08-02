# DevTinder: DSA Features for Tech Interviews

This document outlines the top 3 high-impact Data Structures and Algorithms (DSA) features implemented (or conceptualized) in the **DevTinder** project. These are tailored to impress interviewers at top-tier companies like Bloomberg, showcasing strong CS fundamentals and system design thinking beyond standard CRUD operations.

---

## 🥇 1. Smart Matchmaking Feed ⭐⭐⭐⭐⭐

**The Feature:** 
Instead of a standard chronological feed, users are served a curated feed based on a compatibility score. 

**DSA Concepts to Discuss:**
*   Priority Queue (Max-Heap)
*   Ranking Algorithm & Scoring
*   Pagination
*   Feed Generation
*   Time Complexity (`O(N log K)`)

**The Interview Pitch:**
> *"In my DevTinder app, I wanted to move beyond basic database sorting. I implemented a scoring algorithm that weighs factors like shared tech stack and experience. To efficiently serve the top recommendations without sorting the entire database, I designed a **Max-Heap (Priority Queue)**. When generating the feed, I evaluate a batch of users, insert their compatibility scores into the Max-Heap, and pop off the top 'K' most compatible profiles. This optimizes feed generation and demonstrates an understanding of pagination and algorithmic time complexity beyond standard CRUD."*

---

## 🥈 2. Mutual Connections ⭐⭐⭐⭐⭐

**The Feature:**
Displaying "2nd-degree connections" or "Mutual Friends" to build trust and show how users are linked within the developer network.

**DSA Concepts to Discuss:**
*   Graphs (Undirected)
*   Breadth-First Search (BFS)
*   Recommendation Systems
*   Social Network Modeling

**Example Graph:**
```text
A ---- B ---- C
 \      |
  \     |
    D
```

**The Interview Pitch:**
> *"Bloomberg and other top tech firms heavily utilize graph problems, so I modeled user connections as an undirected graph. To suggest 'People You May Know' or highlight mutual connections, I utilized **Breadth-First Search (BFS)**. Starting from the current user, I traverse the graph up to 2 or 3 degrees of connection. This approach allows me to efficiently find overlapping nodes (mutual friends) and suggest relevant profiles, showcasing my ability to apply graph theory to real-world social network modeling."*

---

## 🥉 3. LRU Cache ⭐⭐⭐⭐⭐

**The Feature:**
Caching highly viewed or popular developer profiles in memory to reduce database load and improve response times.

**DSA Concepts to Discuss:**
*   Hash Map
*   Doubly Linked List
*   Cache Eviction Strategies
*   System Optimization

**The Interview Pitch:**
> *"To handle potential high traffic for popular profiles, I needed a caching layer. Instead of just plugging in Redis out of the box, I first implemented a custom **Least Recently Used (LRU) Cache myself using a HashMap and a Doubly Linked List**. This allowed me to deeply understand the underlying `O(1)` eviction strategy. After validating the custom implementation, I compared its performance and scalability with Redis. This demonstrates not just tool familiarity, but strong CS fundamentals and a deep understanding of memory management and system optimization."*
