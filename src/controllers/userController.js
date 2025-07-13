const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');
const { publishUserCreated } = require('../events/publisher');

exports.registerUser = async (req, res) => {
  const { username, password, email, fullname, phone, birthdate } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const userId = await createUser(username, hashedPassword, email, fullname, phone, birthdate);

    // 🔥 Ahora sí, enviar el password a auth-service
    await publishUserCreated({
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
