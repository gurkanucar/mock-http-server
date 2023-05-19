require("dotenv").config();

const APP_PREFIX = process.env.APP_PREFIX;
const { base64Decode } = require("../helper/encodeDecode");
const { ApiType, shouldThrowError } = require("../helper/responseHelper");
const { loadRoutes } = require("./routeDB");

const handleRequest = async (req, res, route) => {
  let {
    id,
    httpMethod,
    routePath,
    delay,
    responseType,
    apiType,
    successResponse,
    successStatus,
    errorResponse,
    errorStatus,
    routeName,
  } = route;

  delay = Number(delay);
  if (delay == undefined || delay == null) delay = 0;

  setTimeout(() => {
    res.set(
      "Content-Type",
      apiType == ApiType.REST ? "application/json" : "application/soap+xml"
    );
    try {
      if (shouldThrowError(responseType)) {
        return res.status(Number(errorStatus)).send(errorResponse);
      } else {
        return res.status(Number(successStatus)).send(successResponse);
      }
    } catch (parseErr) {
      console.error(parseErr);
      return res
        .status(500)
        .send(apiType == ApiType.REST ? "json parse error" : "soap error");
    }
  }, delay);
};

const setupRoutes = async (app) => {
  app._router.stack = app._router.stack.filter(
    (layer) => !layer.route || !layer.route.path.startsWith(APP_PREFIX)
  );

  const routes = await loadRoutes();

  routes.forEach((route) => {
    let { id, httpMethod, routePath, responseType, apiType, returnValue } =
      route;
    console.log(routePath);
    routePath = APP_PREFIX + routePath;

    app[httpMethod.toLowerCase()](routePath, (req, res) => {
      return handleRequest(req, res, route);
    });
  });
};

module.exports = {
  setupRoutes,
  handleRequest,
};
