const Migrator = require('../../libs/Service/Migrator');
require('dotenv').config(); // Ensure environment variables are loaded

const m = new Migrator();
const tableName = 'post_comment_reply_reactions';

// Check if database type is MySQL or SQLite
if (process.env.DATABASE_TYPE === 'mysql') {
    m.addSql(`DROP TABLE IF EXISTS ${tableName}`);
    m.addSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        comment_id INTEGER NOT NULL,
        reaction TINYINT NOT NULL,
        type TINYINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`);
} else if (process.env.DATABASE_TYPE === 'sqlite') {
    m.addSql(`DROP TABLE IF EXISTS ${tableName}`);
    m.addSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER NOT NULL,
        reaction TINYINT NOT NULL,
        type TINYINT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`);
} else {
    throw new Error('Unsupported database type');
}

(async () => {
    try {
        console.log('Starting migration...');
        await m.migrate();
        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
})();
