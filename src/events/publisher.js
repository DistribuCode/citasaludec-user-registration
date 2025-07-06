const amqp = require('amqplib');

async function publishUserCreated(user) {
  try {
    // ✅ LOG para verificar exactamente qué enviamos a RabbitMQ
    console.log('🐰 Enviando a RabbitMQ:', user);

    const conn = await amqp.connect('amqp://rabbitmq'); // tu host Docker
    const channel = await conn.createChannel();
    const queue = 'user_created';

    // Asegura la existencia de la cola
    await channel.assertQueue(queue, { durable: true });

    // Envia el objeto user convertido a string
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)), { persistent: true });

    console.log(`📢 Evento enviado a RabbitMQ: ${JSON.stringify(user)}`);

    // Cierra la conexión con un pequeño timeout para asegurar el envío
    setTimeout(() => {
      conn.close();
    }, 500);
  } catch (err) {
    console.error('❌ Error enviando a RabbitMQ:', err);
  }
}

module.exports = { publishUserCreated };
