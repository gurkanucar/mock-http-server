const { loadRoutes } = require("./routeDB");
const {
  HttpMethod,
  ResponseType,
  ApiType,
  handleResponseType,
  shouldThrowError,
} = require("../helper/responseHelper");
const fs = require("fs");
const { getByRouteId } = require("./reponseDB");

const handleRestRequest = async (id, req, res, responseType, returnValue) => {
  try {
    const item = await getByRouteId(id);

    console.log("My response:", item);
    const jsonData = JSON.parse(item.response);

    if (shouldThrowError(responseType)) {
      res.status(jsonData.errorStatus).json(jsonData.error);
    } else {
      res.status(jsonData.successStatus).json(jsonData.data);
    }
  } catch (parseErr) {
    console.error(parseErr);
    res.status(500).send("json parse error");
  }
};

const setupRoutes = async (app) => {
  loadRoutes().then((routes) => {
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
      console.log(httpMethod);

      switch (httpMethod) {
        case HttpMethod.GET:
          app.get(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              console.log(routePath);
              handleRestRequest(id, req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.POST:
          app.post(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              handleRestRequest(req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.PUT:
          app.put(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              handleRestRequest(req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.PATCH:
          app.patch(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              handleRestRequest(req, res, responseType, returnValue);
            }
          });
          break;

        case HttpMethod.DELETE:
          app.delete(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              handleRestRequest(req, res, responseType, returnValue);
            }
          });
          break;
      }
    });
  });
};

module.exports = {
  setupRoutes,
};
