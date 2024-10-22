const DatabaseConnection = require('../../database/database');
const db = new DatabaseConnection();

class Migrator {

    constructor(){
        this.sql = [];
    }

    migrate(){
        this.sql.forEach((sql) => {
            try {
                db.runQuery(sql);
                console.log("Migration executed successfully.");
            } catch (error) {
                console.error("Error executing migration:", error);
            }
        });
    }
    addSql(sql){
        this.sql.push(sql);
    }
}

module.exports = Migrator;