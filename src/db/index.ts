import Database from 'better-sqlite3';
import { config } from '../config';
import { schema } from './schema';

const db = new Database(config.databaseUrl);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
// Enforce foreign key constraints (SQLite disables them by default)
db.pragma('foreign_keys = ON');

// Run schema on startup — idempotent due to IF NOT EXISTS
db.exec(schema);

console.log('✅ Database initialized');

export default db;