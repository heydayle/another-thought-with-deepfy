# Base Stage
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Development Stage
FROM base AS dev
EXPOSE 5173
CMD ["bun", "run", "dev", "--host"]

# Build Stage
FROM base AS builder
RUN bun run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
