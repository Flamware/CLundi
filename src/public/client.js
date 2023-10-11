// Function to submit a new story
console.log("client.js");
async function submitStory() {
    // Get the author and story content from the form
    const authorInput = document.getElementById("author");
    const storyInput = document.getElementById("story");
    const author = authorInput.value;
    const content = storyInput.value;
    const baseUrl = 'http://localhost:8080'; // Update the port to match your server
    const url = `${baseUrl}/api/submit-story`;

    // Create a new story object
    const newStory = { author, content };
    console.log(newStory);
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
            displayStory(newStory);
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
function displayStory(story) {
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
submitButton = document.getElementById("submit-button");
document.addEventListener("DOMContentLoaded", function () {
    // Your code here
    submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        submitStory();
    });
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


