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
    host: 'localhost',
    user: 'axel',
    password: 'qDfXcvS01@',
    database: 'clundi', // Use your database name here
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
app.post('/api/login', async (req, res) => {
    //check if the couple req.body.username and req.body.password exist in the database
    //if yes, send a json with the user_id
    //if no, send a json with the error message
    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [req.body.username, req.body.password]);
        if (results.length == 0) {
            res.status(400).json({ error: 'Username or password incorrect' });
        } else {
            res.status(200).json({ user_id: results[0].user_id });
            //redirect to the main page
        }
    } catch (error) {
    }
});

app.post('/api/register', async (req, res) => {
    //check if the username already exists in the database
    //if yes, send a json with the error message
    //if no, insert the new user in the database and send a json with the user_id
    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ?', [req.body.username]);
        if (results.length == 0) {
            console.log(req.body.username);
            console.log(req.body.password)
            const [results] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password]);
            res.status(200).json({ user_id: results.insertId });
        } else {
            res.status(400).json({ error: 'Username already exists' });
        }
    } catch (error) {
    }
});

// Endpoint to serve the main.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'login.html'));
});
app.get('/api/register', (req, res) => {
    res.sendFile(path.join(publicPath, 'register.html'));
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Initialize database tables (create "stories" and "users" tables)
async function initializeDatabase() {
    try {
        // Create "stories" table
        await db.query(`
            CREATE TABLE IF NOT EXISTS stories (
                story_id INT AUTO_INCREMENT PRIMARY KEY,
                author INT,
                content TEXT NOT NULL
            )
        `);

        // Create "users" table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password CHAR(60) NOT NULL,
                email VARCHAR(255)
            )
        `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating database tables:', error);
    }
}

// Initialize the database tables when the server starts
initializeDatabase();
