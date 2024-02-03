const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const { client, connectDatabase } = require('./database.js'); // Import the database module
const app = express();
const portHTTP = 3000; // HTTP port
const portHTTPS = 8445; // HTTPS port
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const privateKey = fs.readFileSync('../server-key.pem', 'utf8');
const certificate = fs.readFileSync('../server-cert.pem', 'utf8');
const ip = require('ip');

const credentials = { key: privateKey, cert: certificate };
connectDatabase();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour expiration time
}));

app.use(cors());


app.use(express.json());
app.use((req, res, next) => {
    res.charset = 'utf-8';
    next();
});
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    const tokenWithoutBearer = token.slice(7);

    jwt.verify(tokenWithoutBearer, '246887855145@Clundi', (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token:', err);
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        // Set both userId and username in the request
        req.userId = decoded.userId;
        req.username = decoded.username;

        // Set username in the session
        req.session.username = decoded.username;

        next();
    });
};


function requireAuthentication(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}


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


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const { rows } = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (rows.length > 0) {
            req.session.username = username; // Set the username in the session
            const token = jwt.sign({ userId: rows[0].id, username }, '246887855145@Clundi', { expiresIn: '1h' });
            console.log('Generated JWT token:', token);
            console.log('username: ' + req.session.username);
            res.status(200).json({ token });
        } else {
            res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
});

app.post('/submit-story',verifyToken , async (req, res) => {
    const { story } = req.body;
    const author = req.session.username; // Define and use the author
    console.log("Story: " + story);
    if (!story) {
        res.status(400).json({ error: 'Content is required' });
        return;
    }
    try {
        // Insert the story into the database with the author's name
        await client.query('INSERT INTO stories (author, content) VALUES ($1, $2)', [author, story]);
        res.status(201).json();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting the story' });
    }
});

app.post('/submit-comment', verifyToken, async (req, res) => {
    const { storyId, content, parentCommentId } = req.body;
    console.log("StoryId: " + storyId);
    console.log("Comment: " + content);
    console.log("ParentCommentId: " + parentCommentId);

    if (!storyId || !content) {
        res.status(400).json({ error: 'Story ID and comment content are required' });
        return;
    }
    const author = req.session.username;
    try {
        const query = parentCommentId
            ? 'INSERT INTO comments (story_id, author, content, parent_comment_id) VALUES ($1, $2, $3, $4)'
            : 'INSERT INTO comments (story_id, author, content) VALUES ($1, $2, $3)';
        //print $1, $2, $3, $4

        const params = parentCommentId
            ? [storyId, author, content, parentCommentId]
            : [storyId, author, content];

        await client.query(query, params);
        console.log('Comment submitted successfully');
        res.status(201).json({ success: 'Comment added successfully' });
    } catch (error) {
        console.error(error);
        console.log('Error submitting the comment');
        res.status(500).json({ error: 'Error submitting the comment' });
    }
});

app.get('/load-comments', async (req, res) => {
    try {
        // Query the database to retrieve all comments with hierarchical structure
        const results = await client.query(`
            WITH RECURSIVE comment_hierarchy AS (
                SELECT
                    comment_id,
                    story_id,
                    author,
                    content,
                    parent_comment_id,
                    1 AS level,
                    ARRAY[]::text[] AS children -- Initialize an empty array for children
                FROM
                    comments
                WHERE
                    parent_comment_id IS NULL
                UNION ALL
                SELECT
                    c.comment_id,
                    c.story_id,
                    c.author,
                    c.content,
                    c.parent_comment_id,
                    ch.level + 1,
                    ch.children || c.comment_id::text -- Convert comment_id to text for concatenation
                FROM
                    comments c
                        JOIN
                    comment_hierarchy ch ON c.parent_comment_id = ch.comment_id
            )
            SELECT * FROM comment_hierarchy;
        `);

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


app.get('/load-stories-and-comments', async (req, res) => {
    try {
        // Query the database to retrieve all stories
        const results = await client.query('SELECT story_id, author, content FROM stories');
        const stories = results.rows.map(row => ({
                id: row.story_id,
            }
        ));
        // Query the database to retrieve all comments
        const results2 = await client.query('SELECT comment_id, story_id, author, content, parent_comment_id FROM comments');
        const comments = results2.rows.map(row => ({
                id: row.comment_id,
                storyId: row.story_id,
            }
        ));
        // Send the results to the client as a JSON response
        res.status(200).json({ stories, comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stories and comments' });
    }
});
app.get('/load-stories', async (req, res) => {
    try {
        const results = await client.query('SELECT story_id, author, content FROM stories');
        const stories = results.rows.map(row => ({
            story_id: row.story_id,
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

app.delete('/delete-story/:storyId', verifyToken, (req, res) => {
    const storyId = req.params.storyId;
    const username = req.session.username;
    const authToken = req.headers.authorization;
    console.log('Deleting story with ID:', storyId, 'by user:', username);

    const query = 'DELETE FROM stories WHERE story_id = $1 AND author = $2 RETURNING *';
    client.query(query, [storyId, username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting the story');
            return;
        }

        console.log('Deleted rows:', results.rows);

        if (results.rows.length === 0 && username !== 'Karaï') {
            console.log('User not allowed to delete this story');
            res.status(403).send('You are not allowed to delete this story');
            return;
        }

        console.log('Story deleted successfully');
        res.status(200).send('Story deleted successfully');
    });
});
app.delete('/delete-comment/:commentId', verifyToken, (req, res) => {
    const commentId = req.params.commentId;
    const username = req.session.username;
    const query = 'SELECT * FROM comments WHERE comment_id = $1 AND author = $2';
    client.query(query, [commentId, username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting the comment');
            return;
        }
        if (results.rows.length === 0 && username !== 'Karaï') {
            console.log(username);
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
const httpsServer = require('https').createServer(credentials, app);



httpServer.listen(portHTTP, () => {
    console.log(`HTTP Server is running on port ${portHTTP}`);
    console.log(`Server IP: ${ip.address()}`); // Print the local IP address
});

httpsServer.listen(portHTTPS, () => {
    console.log(`HTTPS Server is running on port ${portHTTPS}`);
    console.log(`Server IP: ${ip.address()}`); // Print the local IP address
});