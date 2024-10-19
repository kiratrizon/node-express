const Migrator = require('../../libs/Service/Migrator');
const m = new Migrator();
const tableName = 'users';

m.addSql(`DROP TABLE IF EXISTS ${tableName}`);
m.addSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            username TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );`);

m.migrate();
