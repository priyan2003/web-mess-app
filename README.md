# 💬 Customer Support Messaging Web App

A full-featured **messaging web application** designed for customer support teams to handle and respond to messages from customers efficiently.  
Built with **React, TypeScript, Vite, Tailwind CSS, and Supabase**, the system enables multiple agents to log in simultaneously and manage real-time customer conversations from a unified dashboard.

---

## 🚀 Features

### 🧑‍💼 Agent Portal
- A dedicated interface for **support agents** to view and respond to incoming customer messages.
- Supports **multiple concurrent agents** — all agents can view and reply to messages in real time.

### 📩 Message Management
- Stores real customer messages from a provided **CSV dataset** in a connected database.
- Displays all messages with details like customer name, timestamp, and message content.
- Agents can **respond directly** from the dashboard, simulating a two-way communication system.

### ⚡ Real-Time Updates
- The UI automatically updates with **new incoming messages** without requiring a manual refresh.
- Built using **React Query** and **Supabase real-time listeners** (or a simulated WebSocket approach).

### 🔍 Search & Filtering
- Agents can **search messages or customers** based on keywords.
- Helps quickly locate specific queries or follow-up messages.

### 🚨 Urgency Detection
- Highlights messages that need **immediate attention** (e.g., “loan approval,” “disbursement,” etc.).
- Uses keyword-based heuristics or priority tagging to surface critical inquiries.

### 🧠 Customer Insights
- Displays **additional context** about customers, such as:
  - Previous interaction history  
  - Profile or account details (mocked or fetched from external APIs)

### 💬 Canned Responses
- Pre-configured **stock message templates** for quick replies to common queries.
- Agents can choose from a dropdown of canned responses and send them instantly.

### 🧱 Technology Stack
| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn/UI, Radix UI |
| **Data Layer** | Supabase / PostgreSQL (for messages & customer data) |
| **State Management** | React Query, React Hook Form, Zod |
| **Icons & Components** | Lucide React, Sonner (toasts), Recharts (optional analytics) |

---

## 🗂️ Project Structure
### 🧩 Folder Overview

| Folder | Description |
|:-------|:-------------|
| **src/components** | Contains reusable UI elements like chat, sidebar, and search components. |
| **src/pages** | Includes main application views such as `AgentDashboard` and `MessageView`. |
| **src/hooks** | Custom React hooks for handling real-time updates and message fetching. |
| **src/utils** | Utility functions such as urgency detection and canned responses. |
| **src/lib** | Configuration and setup (e.g., Supabase client, constants). |
| **public** | Static assets (images, icons, etc.). |

