const express = require("express");
const cors = require("cors");
const app = express();

const { setupRoutes } = require("./src/dynamicRoutes/routeGenerator");
const {
  loadRoutes,
  saveRoutes,
  deleteRoute,
  updateRoute,
  addRoute,
} = require("./src/dynamicRoutes/routeDB");
const {
  addResponse,
  loadResponses,
  deleteResponse,
  updateResponse,
  getByRouteId,
} = require("./src/dynamicRoutes/responseDB");

const port = 3000;

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/routes", express.json(), async (req, res) => {
  const routes = await loadRoutes();
  res.json(routes);
});

app.post("/routes", express.json(), async (req, res) => {
  const newRoute = req.body;
  const id = await addRoute(newRoute);
  await addResponse({
    response: newRoute.responseData,
    routeId: id,
  });
  await setupRoutes(app);
  res.sendStatus(200);
});

app.delete("/routes/:id", express.json(), async (req, res) => {
  const routeId = parseInt(req.params.id);
  await deleteRoute(routeId);
  await setupRoutes(app);
  res.sendStatus(200);
});

setupRoutes(app);


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
