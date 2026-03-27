const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const databasePath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');

module.exports = db;
