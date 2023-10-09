// Define an interface for a story
interface Story {
    author: string;
    content: string;
}

// Function to submit a new story
async function submitStory() {
    // Get the author and story content from the form
    const authorInput = document.getElementById("author") as HTMLInputElement;
    const storyInput = document.getElementById("story") as HTMLInputElement;
    const author = authorInput.value;
    const content = storyInput.value;

    // Create a new story object
    const newStory: Story = { author, content };

    try {
        // Send a POST request to the server to submit the story
        const response = await fetch("/api/submit-story", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newStory),
        });

        if (response.ok) {
            // Story submission was successful
            const jsonResponse = await response.json();
            // Add the new story to the page
            displayStory(jsonResponse);
            // Clear the form inputs
            authorInput.value = "";
            storyInput.value = "";
        } else {
            // Handle submission error (e.g., display an error message)
            console.error("Error submitting story");
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

// Function to display a story on the page
function displayStory(story: Story) {
    const storiesContainer = document.getElementById("stories-container");

    // Create a new story element
    const storyElement = document.createElement("div");
    storyElement.classList.add("story");
    storyElement.innerHTML = `
        <h3>${story.author}</h3>
        <p>${story.content}</p>
    `;

    // Add the story to the container
    storiesContainer.appendChild(storyElement);
}

// Event listener for the form submission
const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitStory();
});

// Initial page load: Retrieve and display existing stories (if any)
async function loadStories() {
    try {
        const response = await fetch("/api/get-stories");
        if (response.ok) {
            const stories = await response.json();
            for (const story of stories) {
                displayStory(story);
            }
        } else {
            console.error("Error loading stories");
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}
// client.js

// Function to fetch and display stories
function fetchStories() {
    fetch('/api/get-stories')
        .then((response) => response.json())
        .then((data) => {
            const storiesSection = document.getElementById('stories');
            storiesSection.innerHTML = '<h2>Monday Stories</h2>';

            data.forEach((story) => {
                const storyDiv = document.createElement('div');
                storyDiv.classList.add('story');
                storyDiv.innerHTML = `
                    <h3>${story.author}</h3>
                    <p>${story.content}</p>
                `;
                storiesSection.appendChild(storyDiv);
            });
        })
        .catch((error) => {
            console.error('Error fetching stories:', error);
        });
}

// Call the fetchStories function to load stories when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchStories();
});


// Call the loadStories function to load stories when the page loads
loadStories();
