# 💧 AquaLink – Smart Water Management Web App

AquaLink is a **smart water management and conservation platform** built to help South African households, farmers, and municipalities track, manage, and save water through **IoT-powered monitoring, leak detection, and community engagement**.

This project was developed as part of the **PachiPanda Challenge (Water Conservation: Making Every Drop Count)** — empowering young innovators to build tech solutions for sustainable resource management.

🌐 **Live Project:** [Open in Lovable](https://lovable.dev/projects/f1e33dbf-7dd6-4fd1-a163-0c91ed06ee35)

---

## 🚀 Overview

AquaLink helps users **monitor their water usage in real-time**, detect leaks early, and reduce waste using data-driven insights.  
The platform also encourages **community participation** through leaderboards and sustainability challenges.

---

## 🌍 Key Features

### 💦 Smart Dashboard
- Displays daily, weekly, and monthly water usage.
- Real-time data visualization using charts and graphs.
- Shows cost estimates and consumption insights.

### 🔍 Leak Detection (IoT Simulation)
- Simulated IoT flow sensor generates hourly usage data (litres/minute).
- Detects leaks using continuous flow or abnormal nighttime activity.
- Displays instant alerts when leaks are detected.

### 📲 Alerts & Notifications
- Real-time dashboard alerts (pop-ups) and simulated SMS/email notifications.
- Users can mark leaks as fixed and track water-saving progress.

### 🏆 Community Challenge
- Leaderboard ranking users/communities by water saved.
- Monthly badges such as “Water Hero” and “Leak Fixer.”
- Shows collective community impact (“Together we saved X litres”).

### 🌱 Sustainability Insights
- Offers practical water-saving tips and eco-friendly lifestyle ideas.
- Visualizes total litres saved by all users combined.

### 🔧 Admin Panel
- Allows admins to view all users, leaks, and consumption data per area.
- Generates reports for municipalities and sustainability tracking.

---

## 🧠 Technology Stack

- **Frontend:** React (Vite) + TypeScript  
- **UI Components:** shadcn/ui + TailwindCSS  
- **Backend:** Node.js + Express (simulated IoT API endpoint)  
- **Database:** MongoDB or Firebase (configurable)  
- **Charts & Visualization:** Chart.js / Recharts  
- **Data Simulation:** Randomized IoT-like flow data (every 5 seconds)

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js & npm installed ([install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git (for cloning this repository)

### Steps

```bash
# 1️⃣ Clone the repository
git clone <YOUR_GIT_URL>

# 2️⃣ Navigate to the project folder
cd <YOUR_PROJECT_NAME>

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev


