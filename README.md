# 📈 Stock Exchange

A simplified **Stock Exchange Simulation** built to understand how trades are executed, orders are matched, and prices are updated in real time.  

This project implements the core concepts of an exchange using an **order-matching engine**, **Redis queues**, and **real-time WebSocket updates**.

---

## 🚀 Features

- **Order Placement** – Place buy/sell orders via REST API (`POST /api/v1/order`).  
- **Order Matching Engine** – Matches incoming orders using price-time priority.  
- **Trade Execution** – Generates trade events with executed price and quantity.  
- **Real-Time Market Data** – WebSocket streams for trades, ticker, and market depth.  
- **Redis Pub/Sub & Queues** – Used for decoupling API, Engine, and Database layers.  
- **Time Series Database** – Stores executed trades for historical price data.  

---

## 🏗️ Architecture

The flow of the system:

1. **Browser (Client)**  
   - Sends new orders via REST API.  
   - Subscribes to WebSocket for live updates.  

2. **API Service**  
   - Accepts incoming orders (`POST /api/v1/order`).  
   - Pushes orders into a **Redis queue** for processing.  

3. **Matching Engine**  
   - Consumes orders from the queue.  
   - Matches orders (buy vs sell).  
   - Publishes **trade events** (executed quantity, price).  

4. **Redis Pub/Sub & Queues**  
   - Broadcasts trade, ticker, and depth updates.  
   - Decouples services for scalability.  

5. **Database Processor**  
   - Reads executed trades from queue.  
   - Stores them into a **Time-Series Database** (price, timestamp).  

6. **WebSocket Service**  
   - Pushes live updates to clients (trades, ticker, depth).  

---


## ⚙️ Tech Stack

- **Backend:** Node.js / TypeScript  
- **Data Store:** Redis (Pub/Sub + Queues)  
- **Database:** Time-Series DB (TimescaleDB)  
- **Frontend:** Nextjs (Order Book UI, Charts)  
- **Transport:** REST API + WebSocket  