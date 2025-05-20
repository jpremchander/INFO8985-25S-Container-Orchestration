# Build Stage
FROM node:latest AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM unit:latest
COPY --from=build /app/dist/client /usr/share/unit/webpage
COPY ./unit-config.json /docker-entrypoint.d/config.json
CMD ["unitd","--no-daemon","--control","0.0.0.0:8080"]