const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;
const mysql = require('mysql2/promise'); // Import the MySQL library

// Middleware to parse JSON data
app.use(express.json());

// Create a MySQL connection pool
const db = mysql.createPool({
    host: '/',
    user: '/',
    password: '/',
    database: '/',
});

// Route to handle user input
app.post('/addText', async (req, res) => {
    const userInput = req.body.userInput;

    try {
        // Insert user input into the database
        const [results] = await db.query('INSERT INTO your_table (user_input) VALUES (?)', [userInput]);
        res.send('Data inserted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting data');
    }
});

// Serve static files from the "public" directory
const publicPath = path.join(__dirname, ''); // Specify the path to your static files
app.use(express.static(publicPath));

// Temporary storage for stories (in-memory array)
const stories = [];

// Endpoint to submit a new story
app.post('/api/submit-story', async (req, res) => {
    const { author, content } = req.body;

    if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required.' });
    }

    try {
        // Insert the story into the MySQL database
        const [results] = await db.query('INSERT INTO stories (author, content) VALUES (?, ?)', [author, content]);
        const newStory = { id: results.insertId, author, content };

        res.status(201).json(newStory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting the story into the database');
    }
});


// Endpoint to retrieve all stories
app.get('/api/get-stories', async (req, res) => {
    try {
        // Retrieve stories from the MySQL database (use the correct table name)
        const [results] = await db.query('SELECT * FROM stories');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving stories');
    }
});


// Endpoint to serve the main.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'main.html'));
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
