// Function to send a POST request for submitting a story
async function submitStory() {
    const story = document.getElementById("story").value;

    try {
        const response = await fetch(`/submit-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ story: story })
        });

        if (response.ok) {
            await refreshContent();
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
// Function to send a GET request to load replies
async function loadreplies() {
    try {
        const response = await fetch('/load-replies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const replies = data.replies;

            if (replies && replies.length > 0) {
                replies.forEach(reply => {
                    const storySection = document.getElementById(reply.comment_id);
                    const replySection = createCommentSection(reply);
                    storySection.appendChild(replySection);
                });
            }
        } else {
            console.error("Server returned an error:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
async function loadStories(storiesContainer) {
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
                data.stories.forEach((story, index) => {
                    const storySection = createStorySection(story);
                    storiesContainer.appendChild(storySection);
                });
            }
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
// Function to create a story section
function createStorySection(story) {
    const storySection = document.createElement("section");
    storySection.className = "story";
    storySection.id = story.id;
    const author = createParagraph("author", story.author);
    const content = createParagraph("content", story.content);
    storySection.appendChild(author);
    storySection.appendChild(content);
    console.log("Adding story:", story);
    //add comment button and text area
    console.log("Adding comment button and text area");
    console.log("Story id:", story.id);
    console.log("Story author:", story.author);
    console.log("Story content:", story.content);

    const replyButton = createCommentForm(story);
    storySection.appendChild(replyButton);
    return storySection;
}


function createParagraph(className, text) {
    const paragraph = document.createElement("p");
    paragraph.className = className;
    paragraph.innerText = text;
    return paragraph;
}
async function refreshContent() {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = ''; // Clear existing content.

    // Load the latest stories and comments.
    await loadStories(storiesContainer);
    await loadComments();
}

// Function to send a GET request to load comments
async function loadComments() {
    try {
        const response = await fetch('/load-comments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const comments = data.comments;

            if (comments && comments.length > 0) {
                comments.forEach(comment => {
                    console.log("Adding comment:", comment);
                    if (!comment.parent_comment_id) {
                        const storySection = document.getElementById(comment.story_id);
                        const commentSection = createCommentSection(comment);
                        storySection.appendChild(commentSection);
                    }
                    else {
                        const parentCommentSection = document.getElementById(comment.parent_comment_id);
                        const replySection = createCommentSection(comment);
                        parentCommentSection.appendChild(replySection);
                    }
                });
            }
        } else {
            console.error("Server returned an error:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
// Function to create a comment section
function createCommentSection(comment) {
    const commentSection = document.createElement("section");
    commentSection.className = "comment";
    commentSection.id = comment.comment_id;
    const author = createParagraph("author", comment.author);
    const content = createParagraph("content", comment.content);
    commentSection.appendChild(author);
    commentSection.appendChild(content);
    //add comment button and text area
    const replyButton = createCommentForm(comment);
    commentSection.appendChild(replyButton);
    return commentSection;
}
// Function to create a comment form
function createCommentForm(comment) {
    const form = document.createElement("form");
    form.className = "comment-form";
    form.id = "comment-form-" + comment.comment_id;
    const textArea = document.createElement("textarea");
    textArea.className = "comment-input";
    textArea.id = "comment-input-" + comment.comment_id;
    textArea.placeholder = "Reply to this comment";
    form.appendChild(textArea);
    const submitButton = document.createElement("button");
    submitButton.className = "comment-submit";
    submitButton.innerText = "Reply";
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        submitComment(comment);
    });
    form.appendChild(submitButton);
    return form;
}
// Function to send a POST request for submitting a comment
async function submitComment(comment) {
        //if it is a reply, get the parent comment id

        const commentInput = document.getElementById("comment-input-" + comment.comment_id);
        const content = commentInput.value;
        //if comment.story_id is undefined, set storyId to comment.id
        const storyId = comment.story_id ? comment.story_id : comment.id;
        try {
        const response = await fetch(`/submit-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storyId: storyId,comment: content, parentCommentId: comment.comment_id })
        });

        if (response.ok) {
            await refreshContent();
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("submit-story-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        submitStory();
    });

    const storiesContainer = document.getElementById("stories-container");
    refreshContent(storiesContainer);
});