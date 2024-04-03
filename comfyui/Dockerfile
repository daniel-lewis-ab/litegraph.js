# Use the official Nginx image as a parent image
FROM nginx:latest

# Set the working directory in the container to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html/
COPY . .
# Copy the Nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]

