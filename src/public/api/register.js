async function register() {
    // Get the values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value; // Get the email value
    const confirmPassword = document.getElementById("confirm-password").value;
    const baseurl = window.location.origin;

    console.log(username + password + email + confirmPassword);

    try {
        // Send a POST request to the server
        console.log("Sending POST request to /register from base URL: " + baseurl + "/register");
        const response = await fetch(baseurl + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password, email: email, confirmPassword: confirmPassword })
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
    // Add an event listener to the form submission
    const form = document.getElementById("create-account-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        register();
    });
});
