const pool = require('../config/db');

exports.createUser = async (username, hashedPassword, email, fullname, phone, birthdate) => {
  const query = `
    INSERT INTO users (username, password, email, fullname, phone, birthdate)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const values = [username, hashedPassword, email, fullname, phone, birthdate];
  const result = await pool.query(query, values);
  return result.rows[0];
};
