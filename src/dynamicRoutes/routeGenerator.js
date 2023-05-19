require("dotenv").config();

const APP_PREFIX = process.env.APP_PREFIX;
const { ApiType, shouldThrowError } = require("../helper/responseHelper");
const { getByRouteId, loadResponses } = require("./responseDB");
const { loadRoutes } = require("./routeDB");

const handleRequest = async (
  id,
  req,
  res,
  responseType,
  apiType,
  returnValue
) => {
  res.set(
    "Content-Type",
    apiType == ApiType.REST ? "application/json" : "application/soap+xml"
  );
  try {
    const item = await getByRouteId(id);
    if (!item) {
      return res
        .status(500)
        .send(apiType == ApiType.REST ? "json parse error" : "soap error");
    }
    const jsonData = JSON.parse(item.response.replace(/\\\\\\/g, ""));

    if (shouldThrowError(responseType)) {
      return res.status(jsonData.errorStatus).send(jsonData.error);
    } else {
      return res.status(jsonData.successStatus).send(jsonData.data);
    }
  } catch (parseErr) {
    console.error(parseErr);
    return res
      .status(500)
      .send(apiType == ApiType.REST ? "json parse error" : "soap error");
  }
};

const setupRoutes = async (app) => {
  app._router.stack = app._router.stack.filter(
    (layer) => !layer.route || !layer.route.path.startsWith(APP_PREFIX)
  );
  loadResponses();
  const routes = await loadRoutes();

  routes.forEach((route) => {
    let { id, httpMethod, routePath, responseType, apiType, returnValue } =
      route;
    console.log(routePath);
    routePath = APP_PREFIX + routePath;

    app[httpMethod.toLowerCase()](routePath, (req, res) => {
      return handleRequest(id, req, res, responseType, apiType, returnValue);
    });
  });
};

module.exports = {
  setupRoutes,
  handleRequest,
};
