FROM oven/bun:1.2.18-alpine AS base

WORKDIR /app

COPY package*.json bun.lock tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./

RUN bun install

COPY ./src ./src

COPY ./public ./public

COPY index.html index.html

ARG UI_PORT

ARG API_HOST

ARG API_PORT

ARG USE_HTTPS

ENV UI_PORT=$UI_PORT

ENV VITE_API_HOST=$API_HOST

ENV VITE_API_PORT=$API_PORT

ENV VITE_USE_HTTPS=$USE_HTTPS


RUN bun run build

FROM nginx:stable-alpine

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=base /app/dist /usr/share/nginx/html

# Set default values if not provided
ENV SERVER_NAME=localhost
ENV UI_PORT=5001

# Expose the application port
EXPOSE ${UI_PORT}

# Start nginx (will automatically process templates with envsubst)
CMD ["nginx", "-g", "daemon off;"]
