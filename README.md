# AI CRM SaaS

An AI-powered CRM platform designed to simplify lead management, streamline sales workflows, and provide valuable insights into sales performance. Built with React, Node.js, Express.js, and MongoDB, the application enables users to manage leads, track sales opportunities, monitor business performance, and organize notes and tasks in one place. The project also includes AI-powered features designed to assist with lead analysis, sales email generation, and actionable business insights.

## Stack
- React 19 + Vite + Tailwind CSS v4
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs authentication
- Openrouter API key
- **[Recharts](https://recharts.org)**: charts for the dashboard (pipeline engagement area chart)
- **[Axios](https://axios-http.com)**: HTTP client with interceptors for the auth token and 401 handling
- **[Lucide React](https://lucide.dev)**: icon set used across the UI
- **[Sonner](https://sonner.emilkowal.ski)**: toast notifications for success and error messages

## Features
- Registration, login and persistent JWT sessions
- Owner-scoped multi-user data isolation
- Dashboard analytics and six-month lead trend
- Leads CRUD, search, filters and pipeline ordering
- AI lead summary, risk score, priority and next-best action
- AI sales email generation
- AI pipeline sales insights
- Contacts with search, tags and favorites
- Notes linked to leads/contacts and pinning
- Follow-up tasks with completed timestamps
- Five-stage visual sales pipeline
- Demo data seeding

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET. GEMINI_API_KEY enables AI features.
npm run seed
npm run dev
```

The API runs on `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite app runs on `http://localhost:5173`.

### Demo account
After seeding:
- Email: `demo@ai-crm.local`
- Password: `Test1234`

The demo account is intended for local development/testing. Change or remove it before production use.
