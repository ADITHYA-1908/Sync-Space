# SyncSpace

> **SyncSpace** is a modern full-stack MERN real-time team communication platform inspired by Slack and Microsoft Teams.

---

## 📌 Project Overview

This repository is organized as a clean monorepo containing:
- **`client/`**: React 19 single-page application built with Vite and Tailwind CSS.
- **`server/`**: Node.js + Express REST API configured with ES modules, CORS, and centralized error handling.

> **Current Milestone: Part 3 — MongoDB Database Setup and Data Models (Completed).**  
> - **Part 1**: Project setup, React + Vite frontend, Express backend, and health-check API.  
> - **Part 2**: Professional Slack/Teams-inspired UI layout, modular components, and responsive mobile drawer.  
> - **Part 3**: MongoDB database layer with Mongoose 9, robust connection management, 7 data models (User, Workspace, WorkspaceMembership, Channel, ChannelMembership, Conversation, Message), compound unique indexes, data integrity constraints, enriched `/api/health` diagnostics, and automated DB verification.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React Icons |
| **Backend** | Node.js (v22+), Express 4, MongoDB, Mongoose 9, CORS, Dotenv, Nodemon |
| **Tooling** | Concurrently, NPM Scripts, Oxlint |

---

## 📂 Project Structure

```text
SyncSpace/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets (favicons, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── MessageInput.jsx    # Auto-resizing message composer & formatting bar
│   │   │   │   ├── MessageItem.jsx     # Individual message with reactions & action bar
│   │   │   │   └── MessageList.jsx     # Auto-scrolling feed & welcome banner
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx           # Notification count badge
│   │   │   │   └── UserAvatar.jsx      # Initials avatar with active status dot
│   │   │   ├── layout/
│   │   │   │   ├── ChannelSidebar.jsx  # Channels, DMs, filter search, & user card
│   │   │   │   ├── ChatHeader.jsx      # Active channel header & responsive actions
│   │   │   │   └── WorkspaceSidebar.jsx# Workspace rail, switcher, & health diagnostic
│   │   │   └── modals/
│   │   │       ├── HealthStatusModal.jsx# Diagnostic modal (Part 1 & 3 API verification)
│   │   │       ├── InfoModal.jsx       # Informative notices for future roadmap actions
│   │   │       └── NewChannelModal.jsx # Create local channels dialog
│   │   ├── data/
│   │   │   └── mockData.js             # Seed data for workspaces, channels, DMs, & messages
│   │   ├── App.jsx                     # Top-level workspace layout & state management
│   │   ├── index.css                   # Tailwind CSS v4 imports & custom dark scrollbars
│   │   └── main.jsx                    # React 19 application mount
│   ├── .env.example            # Example frontend environment variables
│   ├── .env                    # Local frontend environment variables (git-ignored)
│   ├── .gitignore              # Client-specific Git ignores
│   ├── index.html              # HTML template with SyncSpace branding
│   ├── package.json            # Frontend dependencies & scripts
│   └── vite.config.js          # Vite config with React & Tailwind plugins
│
├── server/                     # Backend Node.js + Express application
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Mongoose connection with retry & graceful shutdown
│   │   ├── controllers/
│   │   │   └── health.controller.js  # /api/health with DB readyState checking
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Centralized 404 & error handlers
│   │   ├── models/
│   │   │   ├── User.js               # Normalized email, hidden passwordHash, status
│   │   │   ├── Workspace.js          # Workspace with ownerId and slug
│   │   │   ├── WorkspaceMembership.js# Compound unique index (workspaceId + userId)
│   │   │   ├── Channel.js            # Workspace-scoped unique channel names & type
│   │   │   ├── ChannelMembership.js  # Compound unique index (channelId + userId)
│   │   │   ├── Conversation.js       # 1-to-1 DMs with deterministic participant sorting
│   │   │   ├── Message.js            # Mutual exclusivity validator & chronological index
│   │   │   └── index.js              # Central model exporter
│   │   ├── routes/
│   │   │   └── health.routes.js      # Health check router definition
│   │   ├── scripts/
│   │   │   └── verifyDb.js           # Safe dev verification script for Mongoose models
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # HTTP listener & database connection startup
│   ├── .env.example            # Example backend environment variables
│   ├── .env                    # Local backend environment variables (git-ignored)
│   └── package.json            # Backend dependencies & scripts
│
├── .gitignore                  # Root Git ignore rules (node_modules, .env, etc.)
├── package.json                # Root package.json with concurrent run scripts
└── README.md                   # Project documentation & setup guide
```

---

## 🚀 Getting Started (Windows Guide)

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (verified on `v22.22.3`)
- **NPM**: `v9.0.0` or higher (verified on `v10.9.8`)
- **MongoDB**: Local MongoDB Server or MongoDB Atlas cluster

Check your installed versions:
```powershell
node -v
npm -v
```

---

### 2. Environment Variables Configuration

Both the `client/` and `server/` have `.env.example` templates. Default values work out of the box for local development.

#### Backend (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Local MongoDB URI or MongoDB Atlas URI:
MONGODB_URI=mongodb://localhost:27017/syncspace
```

#### Frontend (`client/.env`)
Create or edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

> **Note:** Real `.env` files are excluded from Git version control by `.gitignore` to prevent credential leaks.

---

### 3. Database Verification Command

Verify that your MongoDB instance is running and that all 7 Mongoose schemas, unique compound indexes, and mutual exclusivity constraints pass validation:

```powershell
npm run db:verify
```

---

### 4. Running the Application

You can install all dependencies from the root directory with one command:
```powershell
npm run install:all
```

Or install them manually in each directory:
```powershell
npm install                  # Root tooling (concurrently)
cd server && npm install     # Express backend dependencies
cd ../client && npm install  # React frontend dependencies
```

---

### 4. Running the Application

You can start the project in two ways:

#### Option A: Run Both Concurrently (Recommended)
From the root directory, run:
```powershell
npm run dev
```
This launches both the Express server (port `5000`) and the Vite React frontend (port `5173`) in a single terminal with color-coded prefixes (`[SERVER]` and `[CLIENT]`).

#### Option B: Run Services Independently
Open two separate terminal windows:

- **Terminal 1 — Backend Server:**
  ```powershell
  # From root:
  npm run server
  # Or navigate to server directory:
  cd server
  npm run dev
  ```

- **Terminal 2 — Frontend Client:**
  ```powershell
  # From root:
  npm run client
  # Or navigate to client directory:
  cd client
  npm run dev
  ```

---

## 🌐 Local URLs and Health Verification

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend UI** | [http://localhost:5173](http://localhost:5173) | SyncSpace interactive web dashboard |
| **Backend Root** | [http://localhost:5000](http://localhost:5000) | API welcome & directory endpoint |
| **Health Check API** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Server health & uptime status JSON |

### How to Verify the Health Endpoint

1. **In the Browser**:
   - Open [http://localhost:5173](http://localhost:5173). The dashboard automatically pings the backend and displays a green **"Connected"** badge, response latency in milliseconds, uptime, and formatted response JSON.
   - Click the **"Refresh Status"** button to re-test the connection on demand.

2. **Using PowerShell**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get | ConvertTo-Json
   ```

3. **Using cURL**:
   ```bash
   curl http://localhost:5000/api/health
   ```

**Expected JSON Response:**
```json
{
  "status": "ok",
  "message": "SyncSpace Server is active and healthy",
  "timestamp": "2026-10-26T13:03:26.823Z",
  "uptime": "17s",
  "environment": "development"
}
```

---

## 🛡️ Error Handling

- **404 Not Found**: Any undefined route returns a clean JSON error response instead of an HTML default error page:
  ```json
  {
    "success": false,
    "error": {
      "message": "Endpoint not found: GET /api/undefined"
    }
  }
  ```
- **Global Error Handler**: Catches any unhandled application exceptions, logs them with timestamps, and returns formatted JSON errors (with stack traces hidden in production).
- **Client Offline Resilience**: If the backend is stopped or unreachable, the frontend gracefully transitions into a disconnected state with troubleshooting instructions rather than crashing.

---

## 🗺️ What's Coming in Part 4
- User registration and login endpoints (Password hashing with Argon2 / Bcrypt)
- JWT token generation, refresh tokens, and authentication middleware
- Workspace & Channel CRUD operations with access authorization
- Direct conversation creation and message persistence APIs


