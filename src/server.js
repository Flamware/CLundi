const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const http = require('http');
const { client, connectDatabase } = require('./database.js'); // Import the database module
const app = express();
const portHTTP = 8080; // HTTP port
const portHTTPS = 8445; // HTTPS port
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
    console.log("Story: " + story);
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

    const { storyId, comment, parentCommentId } = req.body;

    if (!storyId || !comment) {
        res.status(400).json({ error: 'Story ID and comment content are required' });
        return;
    }

    // Use the author from the session data
    const author = req.session.username;

    try {
        // Log the storyId here for debugging
        console.log('Received storyId for comment:', storyId);
        const query = parentCommentId
            ? 'INSERT INTO comments (story_id, author, content, parent_comment_id) VALUES ($1, $2, $3, $4)'
            : 'INSERT INTO comments (story_id, author, content) VALUES ($1, $2, $3)';
        //print $1, $2, $3, $4
        console.log("Query: " + query);
        console.log("Params: " + storyId + ", " + author + ", " + comment + ", " + parentCommentId);


        const params = parentCommentId
            ? [storyId, author, comment, parentCommentId]
            : [storyId, author, comment];

        await client.query(query, params);
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
        // Query the database to retrieve all comments
        const results = await client.query('SELECT comment_id, story_id, author, content, parent_comment_id FROM comments');
        // Send the results to the client as a JSON response
        res.status(200).json({ comments: results.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});
app.get('/load-replies', async (req, res) => {
    try {
        // Query in the database comments that have a parent_comment_id
        const results = await client.query('SELECT comment_id, story_id, author, content, parent_comment_id FROM comments WHERE parent_comment_id IS NOT NULL');
        // Send the results to the client as a JSON response
        res.status(200).json({ replies: results.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching replies' });
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
app.delete('/delete-story/:storyId', (req, res) => {
    const storyId = req.params.storyId;
    const username = req.session.username;
    const query = 'SELECT * FROM stories WHERE story_id = $1 AND author = $2';
    client.query(query, [storyId, username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting the story');
            return;
        }
        if (results.rows.length === 0) {
            res.status(403).send('You are not allowed to delete this story');
            return;
        }
        //delete the story
        const deleteQuery = 'DELETE FROM stories WHERE story_id = $1';
        client.query(deleteQuery, [storyId], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting the story');
                return;
            }
            res.status(200).send('Story deleted successfully');
        });
    });
});
app.delete('/delete-comment/:commentId', (req, res) => {
    const commentId = req.params.commentId;
    const username = req.session.username;
    const query = 'SELECT * FROM comments WHERE comment_id = $1 AND author = $2';
    client.query(query, [commentId, username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting the comment');
            return;
        }
        if (results.rows.length === 0) {
            res.status(403).send('You are not allowed to delete this comment');
            return;
        }
        //delete the comment
        const deleteQuery = 'DELETE FROM comments WHERE comment_id = $1';
        client.query(deleteQuery, [commentId], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting the comment');
                return;
            }
            res.status(200).send('Comment deleted successfully');
        });
    });
});


const httpServer = http.createServer(app);
const httpsServer = https.createServer( app);

httpServer.listen(portHTTP, () => {
    console.log(`HTTP Server is running on port ${portHTTP}`);
});

httpsServer.listen(portHTTPS, () => {
    console.log(`HTTPS Server is running on port ${portHTTPS}`);
});
