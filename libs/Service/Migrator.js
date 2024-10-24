const DatabaseConnection = require('../../database/database');

class Migrator {

    constructor() {
        this.db = new DatabaseConnection();
        this.sql = [];
    }

    migrate() {
        this.sql.forEach((sql) => {
            try {
                this.db.runQuery(sql);
                console.log("Migration executed successfully.");
            } catch (error) {
                console.error("Error executing migration:", error);
            }
        });
    }
    addSql(sql) {
        this.sql.push(sql);
    }
}

module.exports = Migrator;