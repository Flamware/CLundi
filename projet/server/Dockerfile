# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the ports for both HTTP and HTTPS
EXPOSE 3000
EXPOSE 8445

# Command to run your application
CMD ["node", "src/server.js"]
