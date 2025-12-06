# URL Shortener

Small fullstack URL shortener: Express + Prisma (SQLite) backend and Next.js frontend to create short links, track clicks, and handle auth/account.

## How to run
- **Backend**
  1. `cd backend && npm install`
  2. Create `.env` with `DATABASE_URL="file:./prisma/dev.db"`, `JWT_SECRET="your_key"`, `PORT=3000`, and optional `DISCORD_WEBHOOK_URL`.
  3. `npm run prisma:migrate` (creates `dev.db`) then `npm run dev`.
- **Frontend**
  1. `cd frontend && npm install`
  2. Create `.env` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:3000` and `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001`.
  3. `npm run dev -- --port 3001` and open http://localhost:3001.

API docs: `http://localhost:3000/docs`
