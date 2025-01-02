# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./

RUN pnpm install

COPY . .

ARG DATABASE_URLS
ARG AUTH_KEY
ARG ADMIN_KEY

ENV DATABASE_URLS=${DATABASE_URLS}
ENV AUTH_KEY=${AUTH_KEY}
ENV ADMIN_KEY=${ADMIN_KEY}

EXPOSE 3000

# Start the application in production mode
CMD ["sh", "-c", "pnpm run build && pnpm run start:prod"]