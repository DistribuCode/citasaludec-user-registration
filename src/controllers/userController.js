const bcrypt = require('bcrypt');
const fetch = require('node-fetch'); // 👈 asegúrate de instalarlo con: npm install node-fetch
const { createUser } = require('../models/userModel');

exports.registerUser = async (req, res) => {
  const { username, password, email, fullname, phone, birthdate } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const userId = await createUser(username, hashedPassword, email, fullname, phone, birthdate);

    // 🔥 Enviar los datos al auth-service sin RabbitMQ
    await fetch('http://auth-service:3001/auth/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      })
    });

    res.status(201).json({ message: 'User registered', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
