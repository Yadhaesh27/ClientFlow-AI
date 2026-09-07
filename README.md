# 🚀 ClientFlow AI - Enterprise Client Portal & Team Workspace Suite

ClientFlow AI is a modern, high-speed multi-tenant client collaboration portal and project management workspace for agencies, software teams, consultancies, and enterprise clients. It features **Real-Time Gemini AI SSE Token Streaming**, an **AI Command Center Hub** (Scope Creep Detector, Sentiment Radar, Smart Task Assigner), **Dual Company & Client Login Portals**, 1-click deliverable sign-offs with versioning (v1, v2, v3), Kanban task tracking, deterministic project health scoring, and publication-grade executive PDF reporting.

---

## 🔑 Pre-Seeded Demo Accounts & Credentials

| Role | Email | Password | Primary Workspace Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clientflow.demo` | `Demo@123` | Full workspace admin, org setup, team management, executive reports |
| **Client Account** | `client@clientflow.demo` | `Demo@123` | Dedicated Client Portal, 1-click deliverable sign-offs, action center |
| **Project Lead (PM)** | `manager@clientflow.demo` | `Demo@123` | Project health telemetry, sprint task creation, deliverable versioning |
| **Senior Developer** | `developer@clientflow.demo` | `Demo@123` | Kanban task moves, code deliverable uploads, story point estimation |

*Note: You can also use the Quick Demo Launch Buttons on the Login Modal to log in instantly!*

---

## 🌟 Key Features & AI Capabilities

### 1. ✨ Real-Time Gemini AI Copilot (Server-Sent Events Streaming)
- **Global Floating Copilot Widget (`AiCopilotWidget.tsx`)**: Available across all pages for instant workspace assistance with real-time SSE token-by-token typewriter streaming.
- **Context-Aware Project Evaluation**: Answers queries on project health, budget utilization, pending deliverables, and sprint velocity.

### 2. 🤖 AI Command Center Hub (`AiAssistantPage.tsx`)
- **Executive Summary & Multi-Tone Update Drafter**: Generate tailored progress updates in *Executive*, *Friendly*, or *Urgent* tones.
- **Scope Creep & Out-of-Scope Detector**: Scans client feedback text to detect out-of-scope feature requests, calculating extra developer hours and financial cost impact.
- **Client Sentiment & Risk Radar**: Analyzes approval review lag, communication friction, and client satisfaction metrics.
- **Smart Task Auto-Assigner**: Workload-aware engineer matcher suggesting the optimal developer based on skill set and current capacity.
- **Real-Time Copilot Q&A**: SSE token streaming interface bound to live project telemetry.

### 3. 🔑 Dual Login Portals & Sign In Navigation (`LoginPage.tsx`)
- **🏢 Company & Agency Login**: Primary workspace sign-in for Admins, PMs, and Developers to manage engineering sprints.
- **💼 Client Portal Login**: Dedicated portal sign-in for client stakeholders with quick company cards (*Northstar Tech*, *Vertex Studio*, *Quantum Financial*, *Horizon Media*, *Aura Health*).
- **Top Navbar `Sign In` Button**: Clean, unified authentication entry point.

### 4. 📊 Structured 5-Set Workspace Dataset
- **5 Core Projects**: *NextGen AI E-Commerce*, *Mobile Banking & Wealth*, *Cloud Media Streaming*, *Telehealth Patient Care*, *Brand Design Suite*.
- **5 Client Companies**: *Northstar Tech Solutions*, *Vertex Digital Studio*, *Quantum Financial Group*, *Horizon Media Networks*, *Aura Health Systems*.
- **5 Agency Developers**: *Aarav Sharma*, *Priya Patel*, *Marcus Vance*, *Alex Rivera*, *Sarah Jenkins*.
- **5 Tasks per Project (25 Total Tasks)**: Distributed across Kanban swimlanes (*Backlog*, *To Do*, *In Progress*, *Review*, *Done*).
- **5 Data Points per Dashboard Chart**: 5-point datasets across all 8 analytics visualizations.

### 5. 📄 Executive PDF Reports & Audit Documents
- **Executive Completion Certificate**: Deterministic project health breakdown & velocity metrics.
- **Sprint Tasks Audit Matrix**: Issue types, story points, priority tags, and engineer assignments.
- **Client Deliverable Sign-Off Certificate**: Timestamped approvals and client revision notes.
- **1-Click PDF Export & Print**: `@media print` styling for publication-grade PDF exports.

---

## 🛠 Setup & Local Execution

### Option 1: Frontend Only (Instant Standalone)
```bash
cd frontend
npm install
npm run dev
```
Open **http://127.0.0.1:5173**

### Option 2: Full-Stack (FastAPI + SQLite)
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python app/seed.py
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```
Open **http://127.0.0.1:5173**

---

## 🌐 Production Deployment

- **Vercel**: Set root directory to `frontend`, build command `npm run build`, output directory `dist`.
- **Render / Railway**: Set root directory to `backend`, start command `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

© 2026 CLIENTFLOW AI • Enterprise Client & Team Workspace Suite
