// Post request to /submit-story
async function submitStory() {
    // Get the values from the form
    const story = document.getElementById("story").value;
    const baseurl = window.location.origin;
    try {
        // Send a POST request to the server
        console.log("Sending POST request to /submit-story from base URL: " + baseurl + "/submit-story");
        const response = await fetch(baseurl + '/submit-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ story: story })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.redirect) {
                // Redirect to the specified URL (login page)
                window.location.href = data.redirect;
            } else if (data.error) {
                // Display the error message
                document.getElementById("error-message").innerText = data.error;
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle the error as needed
    }
}

async function loadStories() {
    try {
        const response = await fetch('/load-stories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.stories) {
                data.stories.forEach(story => {
                    createStorySection(story, story.id);
                });
            }
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
async function createStorySection(story, storyId) {
    const storiesContainer = document.getElementById("stories-container");
    const storySection = document.createElement("section");
    storySection.className = "story";
    storySection.id = "story-" + storyId;

    const storyAuthor = document.createElement("p");
    storyAuthor.innerText = "Submitted by: " + story.author;

    const storyContent = document.createElement("p");
    storyContent.innerText = story.content;



    const commentForm = document.createElement("form");
    commentForm.id = "comment-form-" + storyId;
    commentForm.className = "comment-form";

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.id = "comment-" + storyId;
    commentInput.placeholder = "Enter a comment";

    const commentButton = document.createElement("button");
    commentButton.type = "submit";
    commentButton.innerText = "Submit";

    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentButton);

    storySection.appendChild(storyContent);
    storySection.appendChild(storyAuthor);
    storySection.appendChild(commentForm);

    storiesContainer.appendChild(storySection);

    commentForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        submitComment(storyId);
    });
}
async function loadcomments() {
    //for each story, load the comments
    try {
        const response = await fetch('/load-comments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.comments) {
                data.comments.forEach(comment => {
                //write the comments to the page
                    createCommentSection(comment, comment.id);
                });
            }
        }
    }catch (error) {
        console.error("An error occurred", error);
    }
}
async function createCommentSection(comment, commentId, storyId) {
    const storySection = document.getElementById("story-" + storyId);
    // Create a comment section inside the appropriate story section
    const commentSection = document.createElement("section");
    commentSection.className = "comment";
    commentSection.id = "comment-" + commentId;

    const commentAuthor = document.createElement("p");
    commentAuthor.innerText = "Submitted by: " + comment.author;

    const commentContent = document.createElement("p");
    commentContent.innerText = comment.content;

    commentSection.appendChild(commentContent);
    commentSection.appendChild(commentAuthor);

    storySection.appendChild(commentSection);
}
async function submitComment(storyId) {
    // Get the values from the form
    const comment = document.getElementById("comment-" + storyId).value;
    const baseurl = window.location.origin;
    try {
        // Send a POST request to the server
        console.log("Sending POST request to /submit-comment from base URL: " + baseurl + "/submit-comment");
        const response = await fetch(baseurl + '/submit-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storyId: storyId, comment: comment })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.redirect) {
                // Redirect to the specified URL (login page)
                window.location.href = data.redirect;
            } else if (data.error) {
                // Display the error message
                document.getElementById("error-message").innerText = data.error;
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle the error as needed
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const storiesContainer = document.getElementById("stories-container");

    const form = document.getElementById("submit-story-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        submitStory();
    });
    loadStories();
    loadcomments();
});
