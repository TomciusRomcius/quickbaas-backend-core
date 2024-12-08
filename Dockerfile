# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

# Start the application in production mode
CMD ["sh", "-c", "pnpm run build && pnpm run start:prod"]