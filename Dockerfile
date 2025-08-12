FROM oven/bun:1.2.18-alpine AS base

WORKDIR /app

COPY package*.json bun.lock tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
RUN bun install

COPY ./src ./src

COPY ./public ./public

COPY index.html index.html

RUN bun run build

FROM nginx:stable-alpine

ARG UI_PORT

# Set environment variables
ENV UI_PORT=$UI_PORT

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=base /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE ${UI_PORT}

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
