const pool = require('../config/db');

async function createUser(username, password, email, fullname, phone, birthdate) {
  const result = await pool.query(
    `INSERT INTO users (username, password, email, fullname, phone, birthdate)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [username, password, email, fullname, phone, birthdate]
  );
  return result.rows[0].id;
}

module.exports = { createUser };
