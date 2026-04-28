# PricePilot

PricePilot is a cross-platform product aggregator built using a microservices architecture.  
The application allows users to search products, compare prices from multiple sources, save favorite items, view price history, and receive real-time notifications.

This project was developed as part of the CSC4309 course project.

---

## Project Overview

PricePilot combines multiple backend services with a modern frontend dashboard to simulate a real-world price comparison platform.

Users can:

- Search for products in real time
- Compare prices across different sources
- Save products to a personal watchlist
- View historical price trends
- Receive real-time notifications
- Access the platform through a responsive dashboard

---

## System Architecture

The project uses three main microservices:

### Frontend Service
- React.js
- Responsive user dashboard
- Product search interface
- Watchlist management
- Price history charts
- Notification display

### Node.js Gateway Service
- Express.js
- JWT authentication
- Main API gateway
- Handles watchlist storage
- Connects frontend to Python service
- Firebase notification integration

### Python Collector Service
- FastAPI
- Collects product pricing data
- Normalizes product data
- Provides internal APIs to Node.js service
- Stores price history using Redis

---

## Features

### Authentication
- User registration
- User login
- JWT-based protected routes

### Product Search
- Search products by keyword
- Real-time results from multiple sources

### Price Comparison Table
- Compare prices from multiple stores in table format

### Watchlist
- Save products to favorites
- Persistent database storage

### Price History
- View product price trends using charts

### Notifications
- Firebase Cloud Messaging integration
- In-app real-time alerts

### DevOps
- Dockerized services
- Single-command startup using Docker Compose

---

## Technology Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js |
| Backend A | Node.js / Express |
| Backend B | Python / FastAPI |
| Database | MongoDB |
| Cache | Redis |
| Authentication | JWT |
| Notifications | Firebase Cloud Messaging |
| Charts | Recharts |
| DevOps | Docker / Docker Compose |

---
| Service          | Port  |
| ---------------- | ----- |
| Frontend         | 3000  |
| Node Gateway     | 5000  |
| Python Collector | 8000  |
| MongoDB          | 27017 |
| Redis            | 6379  |
Main Pages


Login Page
Register Page
Dashboard
Watchlist
Price History Chart

Example Workflow


Register or login
Search for a product
Compare prices
Add item to watchlist
View history chart
Receive notifications
## Installation

