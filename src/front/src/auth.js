// File: auth.js
export function isAuthenticated() {
    // Check if a token is present in localStorage
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token is present, false otherwise
}
