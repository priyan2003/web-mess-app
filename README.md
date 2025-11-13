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
```
web-message-app/
├── src/
│ ├── components/ # Reusable UI components (chat, search, sidebar, etc.)
│ ├── pages/ # Main views (AgentDashboard, MessageView)
│ ├── hooks/ # Custom hooks (real-time updates, message fetching)
│ ├── utils/ # Helper functions (urgency detection, canned responses)
│ └── lib/ # Database/config setup (Supabase client, constants)
├── public/
├── package.json
└── vite.config.ts
```
---