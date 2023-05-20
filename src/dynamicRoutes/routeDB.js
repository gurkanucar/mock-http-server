const fs = require("fs");
const fileLock = require("proper-lockfile");

const { v4: uuidv4 } = require("uuid");
const {
  HttpMethod,
  ResponseType,
  ApiType,
} = require("../helper/responseHelper");
let routes = [];

const convertEnumsToObjects = (routes) => {
  return routes.map((route) => {
    const convertedRoute = { ...route };
    convertedRoute.httpMethod = HttpMethod[route.httpMethod];
    convertedRoute.responseType = ResponseType[route.responseType];
    convertedRoute.apiType = ApiType[route.apiType];

    return convertedRoute;
  });
};

const loadRoutes = async () => {
  try {
    const lockfilePath = "data/routes.lock";

    if (!fs.existsSync(lockfilePath)) {
      fs.writeFileSync(lockfilePath, "");
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    await fileLock.lock(lockfilePath);

    if (!fs.existsSync("data/routes.json")) {
      fs.writeFileSync("data/routes.json", "[]");
      console.log("data/routes.json file created.");
    }

    const routesData = await fs.promises.readFile("data/routes.json", "utf8");
    const tempRoutes = JSON.parse(routesData);
    routes = convertEnumsToObjects(tempRoutes);

    await fileLock.unlock(lockfilePath);

    return routes;
  } catch (err) {
    console.error("Error reading routes file:", err);
    return [];
  }
};

const saveRoutes = async () => {
  await fs.promises.writeFile(
    "data/routes.json",
    JSON.stringify(routes),
    "utf8"
  );
};

const addRoute = async (newRoute) => {
  const newId = uuidv4();
  newRoute = {
    ...newRoute,
    id: newId,
  };
  routes.push(newRoute);
  await saveRoutes();
  return newId;
};

const deleteRoute = async (routeId) => {
  const index = routes.findIndex((route) => String(route.id) === routeId);
  if (index !== -1) {
    routes.splice(index, 1);
    await saveRoutes();
  }
};

const updateRoute = async (id, data) => {
  const index = routes.findIndex((route) => String(route.id) === id);
  if (index !== -1) {
    routes[index] = { ...data, id: id };
    await saveRoutes();
  } else {
    throw new Error("Route not found!");
  }
};

const getById = async (routeId) => {
  const route = routes.find((route) => String(route.id) === routeId);
  if (route) {
    return route;
  }
  throw new Error("Route not found!");
};

module.exports = {
  loadRoutes,
  addRoute,
  deleteRoute,
  updateRoute,
  getById,
  routes,
};
