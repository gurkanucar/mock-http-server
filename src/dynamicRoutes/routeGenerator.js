require("dotenv").config();

const APP_PREFIX = process.env.APP_PREFIX;

const {
  HttpMethod,
  ApiType,
  shouldThrowError,
} = require("../helper/responseHelper");
const { getByRouteId, loadResponses } = require("./responseDB");
const { loadRoutes } = require("./routeDB");

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
  app._router.stack = app._router.stack.filter((layer) => {
    return !layer.route || !layer.route.path.startsWith(APP_PREFIX);
  });

  loadResponses();
  const routes = await loadRoutes();
  routes.forEach((route) => {
    const { id, httpMethod, routePath, responseType, apiType, returnValue } =
      route;
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
        app.post(routePath, (req, res) => {
          if (apiType === ApiType.REST) {
            return handleRestRequest(id, req, res, responseType, returnValue);
          }
        });
        break;
      case HttpMethod.PATCH:
        app.post(routePath, (req, res) => {
          if (apiType === ApiType.REST) {
            return handleRestRequest(id, req, res, responseType, returnValue);
          }
        });
        break;
      case HttpMethod.DELETE:
        app.post(routePath, (req, res) => {
          if (apiType === ApiType.REST) {
            return handleRestRequest(id, req, res, responseType, returnValue);
          }
        });
        break;
    }
  });
};

module.exports = {
  setupRoutes,
  handleRestRequest,
};
