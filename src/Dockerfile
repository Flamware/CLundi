# Use an official Node.js image as a base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Build the production-ready application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview"]
