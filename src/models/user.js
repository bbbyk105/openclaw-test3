const db = require('../db/connection');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function findById(id) {
  const row = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?').get(id);
  return mapUser(row);
}

function createUser({ email, passwordHash, name }) {
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, name)
    VALUES (@email, @passwordHash, @name)
  `);

  const result = stmt.run({ email, passwordHash, name });
  return findById(result.lastInsertRowid);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
