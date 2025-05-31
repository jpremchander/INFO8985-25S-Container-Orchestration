# Stage 1: Build stage - install dependencies only
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production stage - copy only what's needed (clean, smaller image)
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./

EXPOSE 3000

# Run seed.js before starting the app
CMD ["sh", "-c", "node seed.js && node index.js"]
