const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

async function connectDatabase() {
    console.log("Connecting to the database");
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
exports.connectDatabase = connectDatabase;
exports.client = client;
