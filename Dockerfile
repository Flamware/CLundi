# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy your application code from your host to the working directory in the container
COPY src/ /app

# Expose the port that your app will run on
EXPOSE 8080

# Define the command to start your app
CMD ["node", "server.js"]
