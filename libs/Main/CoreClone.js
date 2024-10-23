const DatabaseConnection = require('../../database/database');

class Core {
    constructor(tableName) {
        this.tableName = tableName;
        this.debug = DatabaseConnection.debugger;
        this.values = [];
    }

    find(options){
        let sql = `SELECT `;
        const conditions = options.conditions || {};
        const builtConditions = this.buildConditions(conditions);
        this.values.push(...builtConditions.values);
        sql += `* FROM ${this.tableName} ${builtConditions.sql} LIMIT 1`.trim()+";";
        if (this.debug) {
            console.log("SQL Query:", sql);
            console.log("Query Values:", this.values);
        }

        try {
            let data = DatabaseConnection.runQuery(sql, this.values)[0];
            return data ? data : null;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        } finally {
            this.values = [];
        }
    }
    buildConditions(conditions = {}) {
        let sqlConditions = [];
        let values = [];
    
        Object.entries(conditions).forEach(([key, condition]) => {
            const [operator, conditionValue] = condition; // Destructure operator and value
    
            switch (operator.toUpperCase()) {
                case 'IS':
                    sqlConditions.push(`${key} IS ${conditionValue}`);
                    break;
    
                case 'IN':
                    const placeholders = conditionValue.map(() => '?').join(', ');
                    sqlConditions.push(`${key} IN (${placeholders})`);
                    values.push(...conditionValue); // Add the values to the array
                    break;
    
                case 'BETWEEN':
                    const [lowerBound, upperBound] = conditionValue;
                    sqlConditions.push(`${key} BETWEEN ? AND ?`);
                    values.push(lowerBound, upperBound);
                    break;
    
                // Treat = and LIKE as the same
                case 'LIKE':
                case '=':
                case 'NOT LIKE':
                    sqlConditions.push(`${key} ${operator} ?`);
                    values.push(conditionValue);
                    break;
    
                // You can add more operators as needed
    
                default:
                    throw new Error(`Unsupported operator: ${operator}`);
            }
        });
    
        return {
            sql: sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(' AND ')}` : '',
            values: values
        };
    }
}

module.exports = Core;
