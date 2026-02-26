<img width="768" height="432" alt="screenshot" src="https://github.com/user-attachments/assets/1a45865a-c65b-43cb-8979-6ab822ad618e" />

# URL Shortener

Small fullstack URL shortener: Express + Prisma (PostgreSQL) backend and Next.js frontend to create short links, track clicks, and handle auth/account.

## Run with Docker
1. From repo root, run: `docker compose up --build`
2. Open frontend at `http://localhost:3001`
3. API docs are at `http://localhost:3000/docs`

Services started by Compose:
- `frontend` (Next.js)
- `backend` (Express API)
- `worker` (BullMQ analytics worker)
- `postgres` (PostgreSQL)
- `redis` (Redis)

To stop everything:
- `docker compose down`
- Add `-v` to also remove database/redis volumes: `docker compose down -v`

## Run without Docker
- **Backend & Worker**
  1. `cd backend && npm install`
  2. Create `.env` with `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `HMAC_SECRET`, `PORT=3000`, and optional `DISCORD_WEBHOOK_URL`.
  3. Run `npx prisma db push` and then `npm run dev`.

- **Frontend**
  1. `cd frontend && npm install`
  2. Create `.env` with `NEXT_PUBLIC_BACKEND_URL=http://localhost:3000` and `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001`.
  3. `npm run dev -- --port 3001` and open `http://localhost:3001`.
