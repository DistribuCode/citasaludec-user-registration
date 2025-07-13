const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('user_created', { durable: true });
}

async function publishUserCreated(user) {
  if (!channel) await connectRabbitMQ();

  // Asegurar que solo se envía username y password
  const payload = {
    username: user.username,
    password: user.password
  };

  console.log("🔥 Publicando evento a user_created:", payload);

  channel.sendToQueue('user_created', Buffer.from(JSON.stringify(payload)));
}

module.exports = { publishUserCreated };
