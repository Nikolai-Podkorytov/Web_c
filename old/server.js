const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(express.static('public'));

// Open (or create) the database
const db = new sqlite3.Database('example.db');

// Create the table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL
)`);

// Handle POST request to add a user
app.post('/add-user', (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).send('Name and address are required');
    }

    const query = `INSERT INTO users (name, address) VALUES (?, ?)`;
    db.run(query, [name, address], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to add user');
        }
        res.send(`User added with ID: ${this.lastID}`);
    });
});

// Handle GET request to retrieve all users
app.get('/get-users', (req, res) => {
    const query = `SELECT * FROM users`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to retrieve users');
        }
        res.json(rows);
    });
});

// Handle PUT request to update a user
app.put('/update-user/:id', (req, res) => {
    const id = req.params.id;
    const { name, address } = req.body;

    // Validate input
    if (!name || !address) {
        return res.status(400).send('Name and address are required');
    }

    // Update the record in the database
    const query = `UPDATE users SET name = ?, address = ? WHERE id = ?`;
    db.run(query, [name, address, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to update user');
        }

        // Check if any record was updated
        if (this.changes === 0) {
            return res.status(404).send('User not found');
        }

        res.send(`User with ID: ${id} updated successfully`);
    });
});

// Handle DELETE request to delete a user by ID
app.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id;

    // Validate ID
    if (!id) {
        return res.status(400).send('ID is required');
    }

    // Delete the user from the database
    const query = `DELETE FROM users WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to delete user');
        }

        // Check if any record was deleted
        if (this.changes === 0) {
            return res.status(404).send('User not found');
        }

        res.send(`User with ID: ${id} deleted successfully`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Optional: Close the database connection when the app exits
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
