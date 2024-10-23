const sqlite3 = require('better-sqlite3');
const mysql = require('mysql2');
require('dotenv').config();
const path = require('path');

class DatabaseConnection {
    debugger;
    databaseType;
    connection;
    constructor() {
        this.databaseType = process.env.DATABASE_TYPE;
        this.debugger = (process.env.DEBUGGER || 'false') === 'true';

        if (this.databaseType === 'mysql') {
            this.connection = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
            });
            this.connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to MySQL database:', err.message);
                } else {
                    console.log('Connected to MySQL database.');
                }
            });
        } else if (this.databaseType === 'sqlite') {
            try {
                const dbPath = process.env.SQLITE_FILE;
                this.connection = new sqlite3(dbPath);
            } catch (err) {
                console.error('Error connecting to SQLite database:', err.message);
            }
        } else {
            throw new Error('Unsupported database type');
        }
    }

    // Method to run a query (for SQLite and MySQL)
    runQuery(query, params = []) {
        if (this.databaseType === 'mysql') {
            return new Promise((resolve, reject) => {
                this.connection.query(query, params, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results); // For SELECT, returns the result set
                });
            });
        } else if (this.databaseType === 'sqlite') {
            try {
                if (query.trim().toLowerCase().startsWith('select')) {
                    return this.connection.prepare(query).all(...params); // For SELECT
                } else {
                    const stmt = this.connection.prepare(query);
                    const info = stmt.run(...params); // For INSERT, UPDATE, DELETE
                    return { changes: info.changes, lastID: info.lastInsertRowid }; // Return changes and last ID
                }
            } catch (err) {
                throw new Error(`SQLite query error: ${err.message}`);
            }
        }
    }

    // Method to close the connection
    close() {
        if (this.databaseType === 'mysql') {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error closing MySQL database:', err.message);
                } else {
                    console.log('MySQL connection closed.');
                }
            });
        } else if (this.databaseType === 'sqlite') {
            try {
                this.connection.close();
                console.log('SQLite connection closed.');
            } catch (err) {
                console.error('Error closing SQLite database:', err.message);
            }
        }
    }

    // Additional methods for handling other types of queries can be added here
}

module.exports = new DatabaseConnection();
