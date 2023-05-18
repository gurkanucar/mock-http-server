const amqp = require("amqplib");

const rabbitMQUrl = "amqp://localhost:5672";

async function sendDirectMessage(exchange, routingKey, message) {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", { durable: false });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

    console.log("Message sent to RabbitMQ");
  } catch (error) {
    console.error("Failed to send message to RabbitMQ", error);
  }
}

async function startDirectListener(exchange, queue, routingKey, callback) {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", { durable: false });
    await channel.assertQueue(queue);
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received message from RabbitMQ:", message);
        callback(message);
        channel.ack(msg);
      }
    });

    console.log("RabbitMQ listener started");
  } catch (error) {
    console.error("Failed to start RabbitMQ listener", error);
  }
}

module.exports = {
  sendDirectMessage: sendDirectMessage,
  startDirectListener: startDirectListener,
};
