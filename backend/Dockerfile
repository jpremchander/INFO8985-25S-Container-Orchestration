# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

ENV PORT=5050
ENV MONGO_URI=mongodb://mongo:27017/employees

EXPOSE 5050

CMD ["node", "server.js"]
