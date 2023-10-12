async function register() {
    //get the values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    //send a POST request to the server
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        //redirect to the main page
        window.location.href = '/';
    } else {
        //display the error message
        document.getElementById("error-message").innerText = data.error;
    }
}
//event listener for the form submission
document.addEventListener('DOMContentLoaded', function () {
    //load stories when the page loads
    //your code here
    submitButton = document.getElementById("create-account-button");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        register();
    });
});
