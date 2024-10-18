const DatabaseConnection = require('../../database/database');
const db = new DatabaseConnection();

class Core {
    constructor(tableName) {
        this.tableName = tableName;
        this.debug = db.debugger;
        this.values = [];
    }

    async find(type = 'all', options = {}) {
        let sql = `SELECT `;
        const conditions = options.conditions || {};
        const joins = options.joins || [];
        let fields = options.fields || [];
        const group = options.group || [];
        const order = options.order || [];
        const limitAndOffset = this.buildLimitOffset(options);
        const builtJoins = this.buildJoins(joins);
        const builtConditions = this.buildConditions(conditions);
        this.values.push(...builtConditions.values);
        if (fields.length === 0) {
            fields.push(`${this.modelName}.*`);
            fields.push(...builtJoins.mixedTable);
        }
        if (type === 'count') {
            sql += `count(*) FROM ${this.tableName} AS ${this.modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.buildGroup(group)} ${this.buildOrder(order)}`.trim()+";";
        } else if (type === 'all') {
            sql += `${fields.join(', ')} FROM ${this.tableName} AS ${this.modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.buildGroup(group)} ${this.buildOrder(order)} ${limitAndOffset}`.trim()+";";
        } else if (type === 'first') {
            sql += `${fields.join(', ')} FROM ${this.tableName} AS ${this.modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.buildGroup(group)} ${this.buildOrder(order)} LIMIT 1`.trim()+";";
        } else if (type === 'list') {
            sql += `${fields.join(', ')} FROM ${this.tableName} AS ${this.modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.buildGroup(group)} ${this.buildOrder(order)} ${limitAndOffset}`.trim()+";";
        }
        if (this.debug) {
            console.log("SQL Query:", sql);
            console.log("Query Values:", this.values);
        }

        try {
            let data = await db.runQuery(sql, this.values);
            return data;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        } finally {
            this.values = [];
        }
    }

    async count(params = {}) {
        try {
            let data = await this.find('count', params);
            this.countCache = data[0].count;
            return data[0].count;
        } catch (error) {
            console.error("Error executing count query:", error);
            throw error;
        }
    }

    setAlias(alias) {
        this.modelName = alias;
    }

    buildJoins(joins = []) {
        let sql = '';
        let mixedTable = [];
    
        joins.forEach((ele) => {
            let partialSql = ele.table;
    
            // If there's an alias (as), append it
            if (ele.as && ele.as !== '') {
                partialSql += ` AS ${ele.as}`;
                mixedTable.push(`${ele.as}.*`);
            } else {
                mixedTable.push(`${ele.table}.*`);
            }
    
            // Build the conditions for the ON clause
            if (typeof ele.conditions === 'object') {
                let joinConditions = ele.conditions;
                let joinConditionsKey = Object.keys(joinConditions);
                let conditionsArray = [];
    
                joinConditionsKey.forEach((key) => {
                    let operator = joinConditions[key][0].toUpperCase(); // The operator
                    let conditionValue = joinConditions[key][1]; // The value (can be a column reference or actual value)
    
                    if (operator === 'IS' || operator === 'IS NOT') {
                        conditionsArray.push(`${key} ${operator} ${conditionValue}`);
                    } else if (operator === 'IN') {
                        const placeholders = conditionValue.map((val) => {
                            return `${val}`;
                        }).join(', ');
                        conditionsArray.push(`${key} IN (${placeholders})`);
                    } else if (operator === 'BETWEEN') {
                        const [lowerBound, upperBound] = conditionValue;
                        conditionsArray.push(`${key} BETWEEN ${lowerBound} AND ${upperBound}`);
                    } else {
                        // For operators like =, <>, LIKE, etc.
                        conditionsArray.push(`${key} ${operator} ${conditionValue}`);
                    }
                });
    
                if (conditionsArray.length > 0) {
                    partialSql += ` ON ${conditionsArray.join(' AND ')}`;
                }
            } else if (typeof ele.conditions === 'string') {
                partialSql += ` ON ${ele.conditions}`;
            }
    
            if (partialSql) {
                sql += ` ${ele.type ?? 'INNER'} JOIN ${partialSql}`;
            }
        });
    
        return {
            'sql': sql.trim(),
            'mixedTable': mixedTable
        };
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
    
    buildOrder(orderConditions = []) {
        let orderClauses = [];
    
        orderConditions.forEach(order => {
            // Ensure the order is in the format 'field direction'
            const parts = order.split(' ');
            if (parts.length !== 2) {
                throw new Error(`Invalid order format: ${order}`);
            }
            
            const field = parts[0];
            const direction = parts[1].toUpperCase();
    
            // Validate direction
            if (direction !== 'ASC' && direction !== 'DESC') {
                throw new Error(`Invalid order direction: ${direction}`);
            }
    
            orderClauses.push(`${field} ${direction}`);
        });
    
        return orderClauses.length > 0 ? `ORDER BY ${orderClauses.join(', ')}` : '';
    }
    
    buildGroup(groupConditions = []) {
        // Filter out any empty or invalid values
        const validGroups = groupConditions.filter(field => typeof field === 'string' && field.trim() !== '');
    
        return validGroups.length > 0 ? `GROUP BY ${validGroups.join(', ')}` : '';
    }
    
    buildLimitOffset(options = {}) {
        let limitClause = '';
        let offsetClause = '';
    
        if (options.limit) {
            limitClause = `LIMIT ${options.limit}`;
        }
    
        if (options.offset) {
            offsetClause = `OFFSET ${options.offset}`;
        }
    
        return `${limitClause} ${offsetClause}`.trim(); // Trim to avoid leading spaces
    }
}

module.exports = Core;
