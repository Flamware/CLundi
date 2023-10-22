const { Client } = require("pg");

// Create a new PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for some cloud-hosted databases
    }
});

// Function to establish the connection to the database
const connectDatabase = async () => {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

// Export the client and the connectDatabase function
module.exports = {
    client,
    connectDatabase,
};
