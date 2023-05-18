const express = require("express");
const cors = require("cors");
const app = express();
const rabbitMQ = require("./src/rabbit/rabbitMQ");

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

require("./src/rest/api/restMock")(app);
require("./src/soap/api/soapMock")(app);

// ****** RabbitMQ ********** //

const exchange = "direct_exchange";
const queue = "direct_queue";
const routingKey = "direct_routing_key";

rabbitMQ.sendDirectMessage(exchange, routingKey, "Direct message");

const handleMessage = (message) => {
  console.log("Processing message:", message);
};

rabbitMQ.startDirectListener(exchange, queue, routingKey, handleMessage);
