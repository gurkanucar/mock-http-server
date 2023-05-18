const express = require("express");
const cors = require("cors");
const app = express();
const rabbitMQ = require("./src/rabbit/rabbitMQ");

const { setupRoutes } = require("./src/dynamicRoutes/routeGenerator");
const {
  loadRoutes,
  saveRoutes,
  deleteRoute,
  updateRoute,
  addRoute,
} = require("./src/dynamicRoutes/routeDB");
const { addResponse, loadResponses } = require("./src/dynamicRoutes/reponseDB");

const port = 3000;

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/routes", express.json(), async (req, res) => {
  setupRoutes(app);
  const routes = await loadRoutes();
  res.json(routes);
});
app.post("/routes", express.json(), async (req, res) => {
  const newRoute = req.body;
  console.log(newRoute);
  const id = await addRoute(newRoute);
  addResponse({
    response: newRoute.responseData,
    routeId: id,
  });
  setupRoutes(app);
  res.sendStatus(200);
});

app.delete("/routes/:id", express.json(), (req, res) => {
  const routeId = parseInt(req.params.id);
  deleteRoute(routeId);
  setupRoutes(app);
  res.sendStatus(200);
});

app.put("/routes/:id", express.json(), (req, res) => {
  const routeId = parseInt(req.params.id);
  const updatedRoute = req.body;
  updatedRoute.id = routeId;
  updateRoute(updatedRoute);
  setupRoutes(app);
  res.sendStatus(200);
});

setupRoutes(app);
loadResponses();
// setupRoutes(app);

// loadRoutes();

// saveRoutes();

// deleteRoute();

// updateRoute();

// require("./src/rest/api/restMock")(app);
// require("./src/soap/api/soapMock")(app);

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
