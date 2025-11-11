# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

WORKDIR /etc/nginx/conf.d
COPY nginx.conf.template .

# Replace backend URL at container startup
ENV BACKEND_URL=http://backend:8000
CMD /bin/sh -c "envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
