const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;

app.use(bodyParser.json());

// Serve static files from the "public" directory
const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

// Temporary storage for stories (in-memory array)
const stories = [];

// Endpoint to submit a new story
app.post('/api/submit-story', (req, res) => {
    const { author, content } = req.body;

    if (!author || !content) {
        console.log(author, content);
        return res.status(400).json({ error: 'Author and content are required.' });
    }

    const newStory = { author, content };
    stories.push(newStory);
    res.status(201).json(newStory);
});

// Endpoint to retrieve all stories
app.get('/api/get-stories', (req, res) => {
    res.json(stories);
});

// Endpoint to serve the main.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'main.html'));
});



// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
