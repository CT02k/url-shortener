<img width="768" height="432" alt="screenshot" src="https://github.com/user-attachments/assets/2614b869-0777-45f9-8baa-5d3079089482" />

# URL Shortener

Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.

## How to run
- **Backend**
  1. `cd backend && npm install`
  2. Create `.env` with `DATABASE_URL`, `JWT_SECRET`, `PORT=3000`, and optional `DISCORD_WEBHOOK_URL` for error alerts.
  3. `npm run prisma:migrate` then `npm run dev`.
   
- **Frontend**
  1. `cd frontend && npm install`
  2. Create `.env` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:3000` and `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001`.
  3. `npm run dev -- --port 3001` and open http://localhost:3001.

API docs: `http://localhost:3000/docs`
