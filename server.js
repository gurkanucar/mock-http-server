const express = require("express");
const cors = require("cors");
const app = express();
const rabbitMQ = require("./src/rabbit/rabbitMQ");

const { setupRoutes } = require("./src/dynamicRoutes/routeGenerator");

const port = 3000;

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// require("./src/rest/api/restMock")(app);
// require("./src/soap/api/soapMock")(app);

setupRoutes(app);

// ****** RabbitMQ ********** //

// const exchangeDirect = "direct_exchange";
// const queueDirect = "direct_queue";
// const routingKeyDirect = "direct_routing_key";

// const exchangeFanout = "fanout_exchange";
// const queueFanout = "fanout_queue";

// const exchangeTopic = "topic_exchange";
// const queueTopic = "topic_queue";
// const routingKeyTopic = "topic_routing_key";

// const exchangeHeader = "header_exchange";
// const headers = { type: "important", priority: "high" };
// const queueHeader = "header_queue";

// rabbitMQ.sendDirectMessage(exchangeDirect, routingKeyDirect, "Direct message");
// rabbitMQ.sendFanoutMessage(exchangeFanout, "fanout message");
// rabbitMQ.sendTopicMessage(exchangeTopic, routingKeyTopic,"topic message");
// rabbitMQ.sendHeaderMessage(exchangeHeader, "header message", headers);

// const handleMessage = (message,exchangeType) => {
//   console.log(`${exchangeType} | Processing message: ${message}`);
// };

// rabbitMQ.startDirectListener(exchangeDirect, queueDirect, routingKeyDirect, handleMessage);
// rabbitMQ.startFanoutListener(exchangeFanout, queueFanout, handleMessage);
// rabbitMQ.startTopicListener(exchangeTopic, queueTopic, routingKeyTopic,handleMessage);
// rabbitMQ.startHeaderListener(exchangeHeader, queueHeader, headers, handleMessage);
