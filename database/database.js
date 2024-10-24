const mysql = require('mysql2');
require('dotenv').config();

class DatabaseConnection {
    constructor() {

    }

    openConnection() {
        this.connection = mysql.createConnection({
            host: process.env.MYSQL_ADDON_HOST,
            user: process.env.MYSQL_ADDON_USER,
            password: process.env.MYSQL_ADDON_PASSWORD,
            database: process.env.MYSQL_ADDON_DB,
        });

        // Connect to the MySQL database
        this.connection.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL database:', err.message);
                process.exit(1); // Exit if connection fails
            } else {
                console.log('Connected to MySQL database');
            }
        });
    }

    // Method to run a query
    async runQuery(query, params = []) {
        this.openConnection();
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results); // For SELECT, returns the result set
            });
        });
    }

    // Optional: Method to close the connection
    close() {
        this.connection.end(err => {
            if (err) {
                console.error('Error closing the MySQL connection:', err.message);
            } else {
                console.log('MySQL connection closed.');
            }
        });
    }
}

module.exports = DatabaseConnection;
