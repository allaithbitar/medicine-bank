FROM oven/bun:1.2.18-alpine AS base

WORKDIR /app

COPY package*.json bun.lock tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
RUN bun install

COPY ./src ./src

COPY ./public ./public

COPY index.html index.html

RUN bun run build

FROM nginx:stable-alpine

# Set environment variables
ENV APP_PORT 5001

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=base /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE ${APP_PORT}

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
