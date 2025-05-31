# Stage 1: Install dependencies and build app
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build production files (optional if you want dev mode use `npm run dev`)
RUN npm run build

# Stage 2: Serve with a simple static server or run dev mode
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./

EXPOSE 5000

# For dev mode (vite), or for production serve static files (use "serve" or similar)
CMD ["npm", "run", "dev"]
