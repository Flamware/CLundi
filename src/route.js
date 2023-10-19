const express = require('express');
const db = require('./database');
const path = require("path");
const router = express.Router();


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

router.get('/', requireAuthentication, (req, res) => {
    // Serve the main page here
    res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

router.post('/register', async (req, res) => {
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

module.exports = {
    requireAuthentication,
};
