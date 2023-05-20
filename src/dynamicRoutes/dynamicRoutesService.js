require("dotenv").config();

const APP_PREFIX = process.env.APP_PREFIX;
const RABBIT_ACTION_SUPPORT = process.env.RABBIT_ACTION_SUPPORT;

const {
  loadRoutes,
  addRoute,
  deleteRoute,
  getById,
  updateRoute,
} = require("./routeDB");
const { setupRoutes } = require("./routeGenerator");

exports.getPrefix = (req, res, app) => {
  res.json({ prefix: APP_PREFIX });
};

exports.getRabbitActionSupport = (req, res, app) => {
  res.json({ support: RABBIT_ACTION_SUPPORT === "true" });
};

exports.loadRouteData = async (req, res, app) => {
  const routes = await loadRoutes();
  res.json(routes);
};

exports.createRoute = async (req, res, app) => {
  const newRoute = req.body;
  await addRoute(newRoute);
  await setupRoutes(app);
  res.status(201).json({ message: "created" });
};

exports.deleteRouteById = async (req, res, app) => {
  const routeId = String(req.params.id);
  await deleteRoute(routeId);
  await setupRoutes(app);
  res.sendStatus(200);
};

exports.getRouteDataById = async (req, res, app) => {
  const routeId = String(req.params.id);
  try {
    const result = await getById(routeId);

    res.json(result);
  } catch {
    res.status(404).json({ message: "not found" });
  }
};

exports.updateRouteData = async (req, res, app) => {
  const routeId = String(req.params.id);
  const updatedRoot = req.body;
  const existingRoute = await getById(routeId);

  const fieldsToKeep = [
    "exchangeType",
    "queueName",
    "routingKey",
    "message",
    "headers",
  ];

  fieldsToKeep.forEach((field) => (updatedRoot[field] = existingRoute[field]));

  try {
    await updateRoute(routeId, updatedRoot);
    await setupRoutes(app);
    res.status(200).json({ message: "successfully update!" });
  } catch (err) {
    res.status(404).json({ message: "not found " + err });
  }
};

exports.saveRabbitAction = async (req, res, app) => {
  const routeId = String(req.params.id);

  const existingRoute = await getById(routeId);
  const rabbitAction = req.body;

  try {
    await updateRoute(routeId, {
      ...existingRoute,
      ...rabbitAction,
    });
    await setupRoutes(app);
    res.status(200).json({ message: "successfully update!" });
  } catch (err) {
    res.status(404).json({ message: "not found " + err });
  }
};

exports.deleteRabbitAction = async (req, res, app) => {
  try {
    const routeId = String(req.params.id);

    const existingRoute = await getById(routeId);

    const fieldsToRemove = [
      "exchangeType",
      "queueName",
      "routingKey",
      "message",
      "headers",
    ];

    fieldsToRemove.forEach((field) => delete existingRoute[field]);

    //  console.log("delete action", existingRoute);
    await updateRoute(routeId, existingRoute);
    await setupRoutes(app);
    res.status(200).json({ message: "successfully update!" });
  } catch (err) {
    res.status(404).json({ message: "not found " + err });
  }
};
