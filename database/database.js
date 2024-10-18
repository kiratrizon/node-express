const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2');
const config = require('../env'); // Import the configuration

class DatabaseConnection {
    constructor() {
        this.databaseType = config.database;
        this.debugger = config.debugger;
        if (this.databaseType === 'mysql') {
            this.connection = mysql.createConnection(config.config.mysql);
            this.connection.connect((err) => {
                if (err) {
                    // console.error('Error connecting to MySQL database:', err.message);
                } else {
                    // console.log('Connected to MySQL database.');
                }
            });
        } else if (this.databaseType === 'sqlite') {
            this.connection = new sqlite3.Database(config.config.sqlite.file, (err) => {
                if (err) {
                    // console.error('Error connecting to SQLite database:', err.message);
                } else {
                    // console.log('Connected to SQLite database.');
                }
            });
        } else {
            throw new Error('Unsupported database type');
        }
    }

    // Method to run a query (for SQLite and MySQL)
    runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            if (this.databaseType === 'mysql') {
                this.connection.query(query, params, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            } else if (this.databaseType === 'sqlite') {
                this.connection.all(query, params, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            }
        });
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
            this.connection.close((err) => {
                if (err) {
                    console.error('Error closing SQLite database:', err.message);
                } else {
                    console.log('SQLite connection closed.');
                }
            });
        }
    }

    // Additional methods for handling other types of queries can be added here
}

module.exports = DatabaseConnection;
