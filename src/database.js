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

// ... (previous code)

async function importData() {
    const csvFilePath = "../stories.csv"; // Update with the actual file path

    console.log("Importing data from CSV to the database");

    const fileStream = fs.createReadStream(csvFilePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    // Skip the first line containing column headers
    let firstLineSkipped = false;

    for await (const line of rl) {
        if (!firstLineSkipped) {
            // Skip the first line
            firstLineSkipped = true;
            continue;
        }

        // Split the line into two columns using '\t' as the delimiter (excluding story_id)
        const [author, content] = line.split('\t');

        // Check if author and content are not null or empty before insertion
        if (author && content) {
            try {
                const query = "INSERT INTO public.stories (author, content) VALUES ($1, $2)";
                await client.query(query, [author, content]);
            } catch (error) {
                console.error("Error inserting data:", error);
            }
        }
    }

    console.log("Data imported from CSV to the database");
}
module.exports = {
    client,
    connectDatabase,
};
