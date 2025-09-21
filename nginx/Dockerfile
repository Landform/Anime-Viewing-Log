# Start with the official Nginx image
FROM nginx:stable-alpine

# Remove the default Nginx configuration file that comes with the image
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configuration file from the 'nginx' folder on our host
# into the correct directory inside the container.
COPY nginx.conf /etc/nginx/conf.d/