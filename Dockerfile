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
ARG VITE_DIFY_BASE_URL
ARG VITE_DIFY_API_KEY
ENV VITE_DIFY_BASE_URL=$VITE_DIFY_BASE_URL
ENV VITE_DIFY_API_KEY=$VITE_DIFY_API_KEY
RUN bun run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback: redirect all routes to index.html
RUN printf 'server {\n  listen 80;\n  location / {\n    root /usr/share/nginx/html;\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
