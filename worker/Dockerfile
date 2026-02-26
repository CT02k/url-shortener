FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/url_shortener
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npx tsc

CMD ["npm", "run", "start"]
