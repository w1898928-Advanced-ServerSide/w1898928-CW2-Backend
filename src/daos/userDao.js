const db = require("../config/db");
const { createResponse } = require('../utils/responseUtil');

class UserDAO {
    constructor() {}

    // Inserts a new user into the database.
    async createUser(username, password, email) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
            db.run(sql, [username, password, email], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, { id: this.lastID, username, email }));
            });
        });
    }

    // Retrieves a user by their unique ID.
    async getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, row));
            });
        });
    }

    // Retrieves a user by their username
    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE username = ?`;
            db.get(sql, [username], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, row));
            });
        });
    }

    // Returns all users in the database.
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users`;
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    // Updates an existing user's information.
    async updateUser(id, username, password, email) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?`;
            db.run(sql, [username, password, email, id], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, null, 'User updated'));
            });
        });
    }

    // Deletes a user from the database by ID.
    async deleteUser(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM users WHERE id = ?`;
            db.run(sql, [id], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, null, 'User deleted'));
            });
        });
    }
}

module.exports = UserDAO;