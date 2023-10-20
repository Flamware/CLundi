require('dotenv').config();
const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for some cloud-hosted databases
    }
});

(async () => {
    try {
        await client.connect();

        // Your initial query
        const results = await client.query("SELECT NOW()");
        console.log(results.rows[0]);

        // Call the init function to set up the table
        await init();
    } catch (err) {
        console.error("Error:", err);
    } finally {
        client.end();
    }
})();

// Initialize the database
const init = async () => {
    try {
        // No need to reconnect here, the same client is used
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL
            )
        `);
    } catch (err) {
        console.error("Error initializing the database:", err);
    }
};
