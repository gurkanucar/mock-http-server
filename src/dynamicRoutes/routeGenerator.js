const { loadRoutes } = require("./routeDB");
const {
  HttpMethod,
  ResponseType,
  ApiType,
  handleResponseType,
  shouldThrowError,
} = require("../helper/responseHelper");
const fs = require("fs");
const { getByRouteId, loadResponses } = require("./reponseDB");

const handleRestRequest = async (id, req, res, responseType, returnValue) => {
  try {
    const item = await getByRouteId(id);
    if (item == undefined) {
      return res.status(500).send("json parse error");
    }

    console.log("My response:", item);
    const jsonData = JSON.parse(item.response);

    if (shouldThrowError(responseType)) {
      return res.status(jsonData.errorStatus).json(jsonData.error);
    } else {
      return res.status(jsonData.successStatus).json(jsonData.data);
    }
  } catch (parseErr) {
    console.error(parseErr);
    return res.status(500).send("json parse error");
  }
};

const setupRoutes = async (app) => {
  loadResponses();
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
      console.log(routePath);

      switch (httpMethod) {
        case HttpMethod.GET:
          app.get(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              console.log(routePath);
              return handleRestRequest(id, req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.POST:
          app.post(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              return handleRestRequest(id, req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.PUT:
          app.put(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              return handleRestRequest(id, req, res, responseType, returnValue);
            }
          });
          break;
        case HttpMethod.PATCH:
          app.patch(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              return handleRestRequest(id, req, res, responseType, returnValue);
            }
          });
          break;

        case HttpMethod.DELETE:
          app.delete(routePath, (req, res) => {
            if (apiType === ApiType.REST) {
              return handleRestRequest(id, req, res, responseType, returnValue);
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
