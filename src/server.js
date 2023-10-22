const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const http = require('http');
const { client, connectDatabase } = require('./database.js'); // Import the database module
const app = express();
const portHTTP = 8080; // HTTP port
const portHTTPS = 8443; // HTTPS port
const baseurl = `https://localhost:${portHTTPS}`;
const projectDir = __dirname;

connectDatabase();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Use the express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

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
        const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length > 0) {
            res.status(200).json({ redirect: '' });
        } else {
            await client.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
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
        const { rows } = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (rows.length > 0) {
            // Set the user information in the session
            req.session.isAuthenticated = true;
            req.session.username = username; // Set the user's username in the session
            res.status(200).json({ redirect: '/' });
        } else {
            res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
});



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
        await client.query('INSERT INTO stories (author, content) VALUES ($1, $2)', [author, story]);
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
        await client.query('INSERT INTO comments (story_id, author, content) VALUES ($1, $2, $3)', [storyId, author, comment]);
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
        const results = await client.query('SELECT comment_id, story_id, author, content FROM comments');
        const comments = results.rows.map(row => ({
            id: row.comment_id,
            storyId: row.story_id,
            author: row.author,
            content: row.content
        }));

        if (comments.length > 0) {
            res.status(200).json({ comments });
            console.log("Comments loaded successfully and is: " + JSON.stringify(comments));
        } else {
            res.status(200).json({ comments: [] });
            console.log("No comments found"); // Return an empty array if there are no comments
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});




app.get('/load-stories', async (req, res) => {
    try {
        const results = await client.query('SELECT story_id, author, content FROM stories');
        const stories = results.rows.map(row => ({
            id: row.story_id,
            author: row.author,
            content: row.content
        }));

        if (stories.length > 0) {
            // Reverse the order of stories
            stories.reverse();
            res.status(200).json({ stories });
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
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying the session:', err);
            res.status(500).send('Error logging out');
        } else {
            // Redirect to the login page
            res.redirect('/login');
        }
    });
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
