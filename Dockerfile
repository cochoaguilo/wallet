# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

RUN npm install -g serve@latest

COPY --from=builder /app/www ./www

EXPOSE 4200

CMD [ "serve", "-s", "www" ]
