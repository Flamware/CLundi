async function register() {
    // Get the values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    const baseURL = "http://localhost:8080"; // Remove the space before the URL
    console.log(username + password + confirmPassword);

    try {
        // Send a POST request to the server
        const response = await fetch(baseURL + '/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password, confirmPassword: confirmPassword })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.redirect) {
                // Redirect to the specified URL (login page)
                window.location.href = baseURL + data.redirect;
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
    // Add an event listener to the form submission
    const form = document.getElementById("create-account-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        register();
    });
});
