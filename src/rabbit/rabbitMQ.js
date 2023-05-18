const amqp = require("amqplib");
require("dotenv").config();

const rabbitMQUrl = process.env.RABBITMQ_URL;

const sendMessage = async (
  exchange,
  routingKey,
  message,
  exchangeType,
  options = {}
) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, exchangeType, { durable: false });
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      options
    );

    console.log("Message sent to RabbitMQ");
  } catch (error) {
    console.error("Failed to send message to RabbitMQ", error);
  }
};

const sendDirectMessage = async (exchange, routingKey, message) => {
  await sendMessage(exchange, routingKey, message, "direct");
};

const sendTopicMessage = async (exchange, routingKey, message) => {
  await sendMessage(exchange, routingKey, message, "topic");
};

const sendHeaderMessage = async (exchange, message, headers) => {
  const options = {
    headers: headers,
  };
  await sendMessage(exchange, "", message, "headers", options);
};

const sendFanoutMessage = async (exchange, message) => {
  await sendMessage(exchange, "", message, "fanout");
};

const startListener = async (
  exchange,
  queue,
  routingKey,
  exchangeType,
  callback
) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, exchangeType, { durable: false });
    await channel.assertQueue(queue);
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received message => ", message);
        callback(message, exchangeType);
        channel.ack(msg);
      }
    });

    console.log("started");
  } catch (error) {
    console.error("failed", error);
  }
};

const startDirectListener = async (exchange, queue, routingKey, callback) => {
  await startListener(exchange, queue, routingKey, "direct", callback);
};

const startTopicListener = async (exchange, queue, routingKey, callback) => {
  await startListener(exchange, queue, routingKey, "topic", callback);
};

const startHeaderListener = async (exchange, queue, headers, callback) => {
  const options = {
    arguments: headers,
  };
  await startListener(exchange, queue, "", "headers", callback, options);
};

const startFanoutListener = async (exchange, queue, callback) => {
  await startListener(exchange, queue, "", "fanout", callback);
};

module.exports = {
  sendDirectMessage,
  sendTopicMessage,
  sendHeaderMessage,
  sendFanoutMessage,
  startDirectListener,
  startTopicListener,
  startHeaderListener,
  startFanoutListener,
};
