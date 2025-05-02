# Use the official Node.js LTS image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a startup script
RUN echo '#!/bin/sh\nnode scripts/init-db.js && npm start' > start.sh
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 3000

# Use the startup script as the entry point
CMD ["./start.sh"]