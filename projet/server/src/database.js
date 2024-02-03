const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
const dbUrl = "postgresql://axel:GjAcANJYGMCdQnMvXVHo9w@punchy-dragon-11093.8nj.gcp-europe-west1.cockroachlabs.cloud:26257/clundi?sslmode=verify-full";

const client = new Client({
    connectionString : dbUrl,
    ssl: {
        rejectUnauthorized: false,
    }
});

require('dotenv').config();

async function connectDatabase() {
    console.log("Connecting to the database with URL:", process.env.DATABASE_URL);

    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

exports.connectDatabase = connectDatabase;
exports.client = client;
