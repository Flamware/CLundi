// File: auth.js

// Function to check if a user is authenticated based on the presence of a token
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if a token is present, false otherwise
}

// Function to get the user's username from the decoded token
export function getUserName() {
    const token = localStorage.getItem('token');

    if (token) {
        // Replace this with your logic to decode the JWT and extract the username
        const decodedToken = decodeToken(token);

        if (decodedToken && decodedToken.username) {
            return decodedToken.username;
        }
    }

    return null; // Return null if no username is found
}

// Example function to decode the JWT (replace with your actual implementation)
function decodeToken(token) {
    try {
        // Replace this line with your actual decoding logic (use a JWT library)
        const decoded = JSON.parse(atob(token.split('.')[1]));

        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
