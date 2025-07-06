const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { publishUserCreated } = require('../events/publisher'); // 👈 importamos el publisher

exports.registerUser = async (req, res) => {
  const { username, password, email, fullname, phone, birthdate } = req.body;

  try {
    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Hashear el password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar en la base del user-registration
    const query = `
      INSERT INTO users (username, password, email, fullname, phone, birthdate)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [username, hashedPassword, email, fullname, phone, birthdate];
    const result = await pool.query(query, values);

    // 🚀 Imprime lo que se enviará a RabbitMQ para verificar que lleva el password hash
    console.log('📦 Enviando a publishUserCreated:', {
      id: result.rows[0].id,
      username,
      password: hashedPassword,
      email,
      fullname,
      phone,
      birthdate
    });

    // Publicar el evento a RabbitMQ (el consumer del auth-service lo escuchará)
    await publishUserCreated({
      id: result.rows[0].id,
      username,
      password: hashedPassword,
      email,
      fullname,
      phone,
      birthdate
    });

    // Respuesta al cliente
    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].id
    });

  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
