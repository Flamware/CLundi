# Use an official Node.js runtime as the base image
FROM node:12

# Set the working directory inside the container
WORKDIR /app/public

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port that your application is listening on
EXPOSE 8080

# Define the command to start your application
CMD ["node", "public/server.js"]
