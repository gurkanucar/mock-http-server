const express = require("express");
const cors = require("cors");
const app = express();
const rabbitMQ = require("./src/rabbit/rabbitMQ");
const {
  HttpMethod,
  ResponseType,
  ApiType,
  handleResponseType,
  shouldThrowError,
} = require("./src/helper/responseHelper");

const fs = require("fs");
const xml2js = require("xml2js");

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

const routes = [
  {
    id: 1,
    routeName: "user",
    httpMethod: HttpMethod.GET,
    routePath: "/api/user",
    responseType: ResponseType.RANDOM_ERROR,
    apiType: ApiType.REST,
    returnValue: "user.json",
  },

  // {
  //   id: 2,
  //   routeName: "userById",
  //   httpMethod: HttpMethod.GET,
  //   routePath: "/user/:id",
  //   responseType: ResponseType.RANDOM_ERROR,
  //   apiType: ApiType.REST,
  //   returnValue: "userById.txt",
  // },

  // {
  //   id: 3,
  //   routeName: "userCreate",
  //   httpMethod: HttpMethod.POST,
  //   routePath: "/user",
  //   responseType: ResponseType.RANDOM_ERROR,
  //   apiType: ApiType.REST,
  //   returnValue: "userCreate.txt",
  // },
];

function handleRestRequest(req, res, responseType, returnValue) {
  fs.readFile(returnValue, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("file error");
    } else {
      try {
        const jsonData = JSON.parse(data);

        if (shouldThrowError(responseType)) {
          res.status(jsonData.errorStatus).json(jsonData.error);
        } else {
          res.status(jsonData.successStatus).json(jsonData.data);
        }
      } catch (parseErr) {
        console.error(parseErr);
        res.status(500).send("json parse error");
      }
    }
  });
}

routes.forEach((route) => {
  const {
    id,
    routeName,
    httpMethod,
    routePath,
    responseType,
    apiType,
    returnValue,
  } = route;

  switch (httpMethod) {
    case HttpMethod.GET:
      app.get(routePath, (req, res) => {
        if (apiType === ApiType.REST) {
          handleRestRequest(req, res, responseType, returnValue);
        }
      });
      break;
  }
});

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
