# AI Chat Application

A full-stack AI chat application built with **React**, **NestJS**, **PostgreSQL**, and **Google Gemini AI**.

---

## ✨ Features

- 🖼️ **Multi-modal AI** — AI analyzes uploaded images and PDF documents
- 📌 **Pin Chat** — Keep important conversations at the top of your list
- 💬 **Real-time AI Chat** — powered by Google Gemini (gemini-2.0-flash-lite)
- 📝 **Multiline input** — Shift+Enter for new line, Enter to send
- 📎 **File upload** — attach images and documents to messages
- 🗂️ **Chat sessions** — created with a clean, modular component architecture
- 🌙 **Dark / Light mode** — toggle from the top bar
- 🔍 **Search** — filter conversations by title
- 🕒 **Localized Time** — forced to Asia/Ho_Chi_Minh (GMT+7)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Backend | NestJS 11, Node.js 20, TypeScript |
| Database | PostgreSQL 16 (via Docker) |
| ORM | TypeORM 0.3 |
| AI | Google Gemini API (`gemini-2.0-flash-lite`) |
| File storage | Local disk (`backend/uploads/`) |

---

## 📁 Project Structure

```
ai-conversation/
├── frontend/          # React app (port 5175)
├── backend/           # NestJS API (port 3010)
└── docker-compose.yml # PostgreSQL database
```

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)
- A free **Google Gemini API key** → [Get one here](https://aistudio.google.com/app/apikey)

---

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd ai-conversation
```

---

### Step 2 — Start the database

```bash
docker-compose up -d
```

> This starts a PostgreSQL 16 container on **port 5433**.
> Data is persisted in a Docker volume (`pgdata`).

Verify it's running:
```bash
docker ps
# Should show: ai_conversation   Up
```

---

### Step 3 — Configure the backend

```bash
cd backend
cp .env.example .env   # if .env.example exists, otherwise create .env
```

Edit `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ai_conversation
DB_USER=postgres
DB_PASS=postgres

# App
PORT=3010
NODE_ENV=development
FRONTEND_URL=http://localhost:5175

# Google Gemini AI  ← Required!
GOOGLE_API_KEY=your_gemini_api_key_here
```

> 🔑 **Get your free Gemini API key at:** https://aistudio.google.com/app/apikey

---

### Step 4 — Run the backend

```bash
cd backend
npm install
npm run start:dev
```

Expected output:
```
🚀 Backend running on http://localhost:3010/api/v1
📚 Swagger docs: http://localhost:3010/api/docs
```

> The database schema is auto-created on first run (`synchronize: true` in dev mode).

---

### Step 5 — Run the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v7.0.0  ready in ~400ms
➜  Local:   http://localhost:5175/
```

---

### Step 6 — Open the app

Navigate to **http://localhost:5175** in your browser.

---

## 🔌 REST API Endpoints

Base URL: `http://localhost:3010/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/sessions` | Create a new chat session |
| `GET` | `/chat/sessions` | List all sessions |
| `GET` | `/chat/sessions/:id` | Get session with messages |
| `PATCH` | `/chat/sessions/:id/rename` | Rename a session |
| `DELETE` | `/chat/sessions/:id` | Delete a session |
| `POST` | `/chat/sessions/:id/messages` | Send message (supports file upload) |
| `PATCH` | `/chat/sessions/:id/pin` | Toggle pin status for a session |

> Full API documentation available at: **http://localhost:3010/api/docs** (Swagger UI)

### Example — Send a message

```bash
curl -X POST http://localhost:3010/api/v1/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'

# Returns: { "data": { "id": "...", "title": "My Chat" } }

curl -X POST http://localhost:3010/api/v1/chat/sessions/<session-id>/messages \
  -F "content=Hello, how are you?"

# Returns: { "data": { "userMessage": {...}, "assistantMessage": {...} } }
```

---

## 🗄️ Database Schema

```
chat_sessions   — id, title, userId, isActive, createdAt, updatedAt
chat_messages   — id, sessionId, role (user|assistant), content, metadata, createdAt
chat_files      — id, messageId, originalName, storedName, mimeType, size, url
```

---

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove all data
docker-compose down -v

# View database logs
docker logs ai_conversation
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5433` | PostgreSQL port |
| `DB_NAME` | `ai_conversation` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASS` | `postgres` | Database password |
| `PORT` | `3010` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_URL` | `http://localhost:5175` | Allowed CORS origin |
| `GOOGLE_API_KEY` | *(required)* | Gemini AI API key |

---

## 🚨 Troubleshooting

**Database connection error**
```bash
# Make sure Docker is running
docker-compose up -d
docker ps  # verify ai_conversation is Up
```

**Port already in use**
```bash
# Kill process on port 3010
kill $(lsof -ti:3010)

# Kill process on port 5175
kill $(lsof -ti:5175)
```

**AI not responding / no GOOGLE_API_KEY**
- Add your key to `backend/.env`
- Restart the backend: `npm run start:dev`
- Get a free key at: https://aistudio.google.com/app/apikey

**`npm install` fails**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

---

## 📝 Notes

- Chat history is **fully persisted** in PostgreSQL — sessions survive server restarts
- File uploads are stored in `backend/uploads/chat/` and served as static files
- The AI uses **Gemini 2.0 Flash Lite** by default, with automatic fallback to other Gemini models if quota is exceeded
- No authentication required — designed as a demo/test application
