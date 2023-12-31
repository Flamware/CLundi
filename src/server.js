const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const mysql = require('mysql2/promise');
const session = require('express-session');
const http = require('http');

const app = express();
const portHTTP = 8080; // HTTP port
const portHTTPS = 8443; // HTTPS port
const baseurl = `https://localhost:${portHTTPS}`;
const projectDir = __dirname;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Use the express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'qDfXcvS01@',
    database: 'clundi', // Use your database name here
});

// Middleware to check if the user is authenticated
function requireAuthentication(req, res, next) {
    if (req.session.isAuthenticated) {
        // User is authenticated, allow access to the main page
        next();
    } else {
        // User is not authenticated, redirect to the login page or display an error
        res.redirect('/login');
    }
}

app.get('/', requireAuthentication, (req, res) => {
    // Serve the main page here
    res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

app.post('/register', async (req, res) => {
    const { username, password, email, confirmPassword } = req.body; // Added 'email'

    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        console.log("Username is required");
        return;
    }

    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        console.log("Password is required");
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match' });
        return;
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length > 0) {
            res.status(200).json({ redirect: '' });
        } else {
            const [insertResults] = await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]); // Added 'email'
            res.status(201).json({ redirect: '/login' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting the user into the database');
    }
});


app.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'register.html'));
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }

    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (results.length > 0) {
            // Set the user information in the session
            req.session.isAuthenticated = true;
            req.session.username = username; // Set the user's username in the session
            res.status(200).json({ redirect: '/' });
        } else {
            res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting the user into the database');
    }
});

// Initialize the database tables when the server starts
async function initializeDatabase() {
    try {
        // Create "stories" table
        await db.query(`
            CREATE TABLE IF NOT EXISTS stories (
                                                   story_id INT AUTO_INCREMENT PRIMARY KEY,
                                                   author VARCHAR(255) NOT NULL,
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
        // Add this code in your initializeDatabase function to create the comments table

        await db.query(`
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        story_id INT,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
    )
`);


        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating database tables:', error);
    }
}

// Serve the login page
app.get('/login', (req, res) => {
    console.log("This site was designed by Valérian Rouziès. Axel Antunes wouldn't have succeeded without him.");
    try {
        // Serve the main page here
            res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
    } catch (error) {
        // Handle the error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit-story', requireAuthentication, async (req, res) => {
    const { story } = req.body;

    if (!story) {
        res.status(400).json({ error: 'Content is required' });
        return;
    }

    try {
        // Get the user's username from the session data
        const author = req.session.username; // Get the authenticated user's username

        // Insert the story into the database with the author's name
        const [insertResults] = await db.query('INSERT INTO stories (author, content) VALUES (?, ?)', [author, story]);
        console.log("Story inserted successfully");
        res.status(201).json({ redirect: '/' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting the story' });
    }
});
// Route to submit a comment
app.post('/submit-comment', requireAuthentication, async (req, res) => {
    const { storyId, comment } = req.body;

    if (!storyId || !comment) {
        res.status(400).json({ error: 'Story ID and comment content are required' });
        return;
    }

    // Use the author from the session data
    const author = req.session.username;

    try {
        const [insertResults] = await db.query('INSERT INTO comments (story_id, author, content) VALUES (?, ?, ?)', [storyId, author, comment]);
        console.log('Comment submitted successfully');
        res.status(201).json({ success: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        console.log('Error submitting the comment');
        res.status(500).json({ error: 'Error submitting the comment' });
    }
});


// Route to retrieve comments for a story
app.get('/load-comments', async (req, res) => {
    try {
        const [results] = await db.query('SELECT comment_id, story_id, author, content FROM comments'); // Include story_id
        if (results.length > 0) {
            const comments = results.map(row => ({
               //returning the content of the comment and the author
                id: row.comment_id, // Include story_id in the response
                storyId: row.story_id,
                    author: row.author,
                    content: row.content
}
            ));
            res.status(200).json({ comments: comments });
            console.log("Comments loaded successfully and is : "+comments);
        } else {
            res.status(200).json({ comments: [] });
            console.log("nothing")// Return an empty array if there are no stories

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stories' });
    }
});



app.get('/load-stories', async (req, res) => {
    try {
        const [results] = await db.query('SELECT story_id, author, content FROM stories'); // Include story_id
        if (results.length > 0) {
            const stories = results.map(row => ({
                id: row.story_id, // Include story_id in the response
                author: row.author,
                content: row.content
            }));
            /*rever the stories*/
            stories.reverse();
            res.status(200).json({ stories: stories });
        } else {
            res.status(200).json({ stories: [] }); // Return an empty array if there are no stories
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stories' });
    }
});

app.get('/logout', requireAuthentication, (req, res) => {
    // Destroy the session
    req.session.destroy();
    // Redirect to the login page
    res.redirect('/login');
});

const httpsOptions = {
    key: fs.readFileSync('certs/private.key'),
    cert: fs.readFileSync('certs/certificate.cer'),
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

httpServer.listen(portHTTP, () => {
    console.log(`HTTP Server is running on port ${portHTTP}`);
});

httpsServer.listen(portHTTPS, () => {
    console.log(`HTTPS Server is running on port ${portHTTPS}`);
});

initializeDatabase();
