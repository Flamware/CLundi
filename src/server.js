const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Change this to the desired port

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Temporary storage for stories (in-memory array)
const stories = [];

// Endpoint to submit a new story
app.post('/api/submit-story', (req, res) => {
    const { author, content } = req.body;

    // Basic validation: Check if author and content are provided
    if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required.' });
    }

    // Create a new story object
    const newStory = { author, content };

    // Add the new story to the array
    stories.push(newStory);

    res.status(201).json(newStory);
});

// Endpoint to retrieve all stories
app.get('/api/get-stories', (req, res) => {
    res.json(stories);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

