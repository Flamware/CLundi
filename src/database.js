const mysql = require('mysql2/promise');
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const http = require('http');

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'qDfXcvS01@',
    database: 'clundi',
});

async function initializeDatabase() {
    try {
        // Create "stories" table
        await db.query(`
            CREATE TABLE IF NOT EXISTS stories (
                                                   story_id INT AUTO_INCREMENT PRIMARY KEY,
                                                   author VARCHAR(255) NOT NULL,
                content TEXT NOT NULL
                )
        `);

        // Create "users" table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                                                 user_id INT AUTO_INCREMENT PRIMARY KEY,
                                                 username VARCHAR(255) NOT NULL UNIQUE,
                password CHAR(60) NOT NULL,
                email VARCHAR(255)
                )
        `);
        // Add this code in your initializeDatabase function to create the comments table

        await db.query(`
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        story_id INT,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
    )
`);


        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating database tables:', error);
    }
}


// Define functions for database operations (e.g., insert, select, etc.)

module.exports = { db, initializeDatabase };
