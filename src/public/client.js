async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    try {
        const response = await fetch( '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, confirmPassword })
        });

        if (response.ok) {
            const data = await response.json();

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
    const form = document.getElementById("create-account-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        register();
    });
});
