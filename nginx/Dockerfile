# Use official Node image for build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy frontend code and build
COPY . .
RUN npm run build

# Use Nginx to serve the build
FROM nginx:stable-alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
