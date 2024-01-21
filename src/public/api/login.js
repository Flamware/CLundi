const baseUrl = window.location.origin;
async function login() {
    // Get the values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username + password);
    if (!username) {
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.innerText = "Usernaafnme is required";
        return;
    }

    try {
        console.log("Sending POST request to /login from base URL: " + baseUrl + "/login");
        // Send a POST request to the server
        const response = await fetch( baseUrl+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();
        console.log("Response status code:", response.status);
        if (response.status === 200) {
            console.log("Login successful");
            if (data.redirect) {
                // Redirect to the specified URL (login page)
                window.location.href = data.redirect;

            } else if (data.error) {
                // Display the error message
                const errorMessageElement = document.getElementById("error-message");
                errorMessageElement.innerText = data.error;
            }
        } else if (response.status === 400) {
            console.log("Login failed");
            const errorMessageElement = document.getElementById("error-message");
            errorMessageElement.innerText = "Invalid username or password";
            errorMessageElement.innerText = data.error;
        } else {
            console.error("Response status code:", response.status);
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle the error as needed
    }
}

async function register() {
    // Send a GET request to the server to navigate to the registration page
    window.location.href = baseUrl + "/register";
    try {
        console.log("Sending GET request to /register from base URL: " + baseUrl + "/register");
        const response = await fetch(baseUrl + "/register", {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html'
            }
        });
        console.log("Response status code:", response.status);
        if (response.status === 200) {
            console.log("Redirecting to /register");
        } else {
            console.error("Response status code:", response.status);
        }
    }
    catch (error) {
        console.error("An error occurred:", error); // Handle the error as needed
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the login form submission
    const form = document.getElementById("login-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        login();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the "Sign Up" button
    const signUpButton = document.getElementById("sign-up-button");
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default link behavior
        register();
    });
});
