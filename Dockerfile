# syntax=docker/dockerfile:1

# Stage 1: Build
FROM node:18.20.4-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18.20.4-slim AS production

ENV NODE_ENV=production
ENV PORT=8080
ENV ORIGIN=https://adept.magick.me
ENV HOST=0.0.0.0
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

WORKDIR /app

COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN npm ci --production

EXPOSE 8080

# Use node directly to run the server
CMD ["node", "build/index.js"]