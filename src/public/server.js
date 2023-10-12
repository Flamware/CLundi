const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;
const mysql = require('mysql2/promise'); // Import the MySQL library
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to parse JSON data
app.use(express.json());

// Middleware to check if the user is authenticated
function requireAuthentication(req, res, next) {
    if (req.session.isAuthenticated) {
        // User is authenticated, allow access to the main page
        next();
    } else {
        // User is not authenticated, redirect to the login page or display an error
        res.redirect('/api/login'); // You can change the redirect URL
    }
}

// Serve static files from the "public" directory
const publicPath = path.join(__dirname, ''); // Specify the path to your static files

app.use(express.static(publicPath));

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'axel',
    password: 'qDfXcvS01@',
    database: 'clundi', // Use your database name here
});

// Route to handle user registration
app.post('/api/register', async (req, res) => {
    // Check if the username already exists in the database
    // If yes, send a JSON response with the error message
    // If no, insert the new user in the database and send a JSON response with a redirect URL
    const { username, password, confirmPassword } = req.body;

    switch (true) {
        case !username:
            res.status(400).json({ error: 'Username is required' });
            break;
        case !password:
            res.status(400).json({ error: 'Password is required' });
            break;
        case password !== confirmPassword:
            res.status(400).json({ error: 'Passwords do not match' });
            break;
        default:
            try {
                const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
                if (results.length > 0) {
                    res.status(200).json({ redirect: '' });
                } else {
                    const [results] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
                    res.status(201).json({ redirect: '/api/login' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Error inserting the user into the database');
            }
    }
});
app.get('/api/register', async (req, res) => {
    res.sendFile(path.join(publicPath, 'register.html'));
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    switch (true) {
        case !username:
            res.status(400).json({ error: 'Username is required' });
            break;
        case !password:
            res.status(400).json({ error: 'Password is required' });
            break;
        default:
            try {
                const [results] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
                if (results.length > 0) {
                    // Redirect to the main page upon successful login
                    req.session.isAuthenticated = true;
                    res.status(200).json({ redirect: '/' });
                } else {
                    res.status(400).json({ error: 'Invalid username or password' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Error inserting the user into the database');
            }
    }
});

// Serve the login page
app.get('/api/login', (req, res) => {
    res.sendFile(path.join(publicPath, 'login.html'));
});

// Serve the main page with authentication
app.get('/', requireAuthentication, (req, res) => {
    // Serve the main page here
    res.sendFile(path.join(publicPath, 'main.html'));
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
