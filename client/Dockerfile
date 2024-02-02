# Use the official Node image as base
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 4173

# Command to run the Vite app
CMD ["npm", "run", "serve"]
