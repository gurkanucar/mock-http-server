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

    let retryCount = 0;
    let isLocked = false;
    let routesData = null;

    while (retryCount < 5) {
      try {
        await fileLock.lock(lockfilePath);
        isLocked = true;
        if (!fs.existsSync("data/routes.json")) {
          fs.writeFileSync("data/routes.json", "[]");
          console.log("data/routes.json file created.");
        }
        routesData = await fs.promises.readFile("data/routes.json", "utf8");
        break;
      } catch (err) {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    if (!isLocked) {
      return [];
    }

    const tempRoutes = JSON.parse(routesData);
    routes = convertEnumsToObjects(tempRoutes);

    await fileLock.unlock(lockfilePath);

    return routes;
  } catch (err) {
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

const isDuplicateRoute = (newRoute) => {
  return routes.some(
    (route) =>
      route.routePath == newRoute.routePath &&
      route.httpMethod == newRoute.httpMethod
  );
};

const addRoute = async (newRoute) => {
  if (isDuplicateRoute(newRoute)) {
    throw new Error(
      "Route with the same routePath and httpMethod already exists."
    );
  }

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
  const existingRouteIndex = routes.findIndex(
    (route) => String(route.id) === id
  );
  if (existingRouteIndex !== -1) {
    const existingRoute = routes[existingRouteIndex];
    const updatedRoute = { ...existingRoute, ...data };

    const duplicateIndex = routes.findIndex(
      (route, index) =>
        route.id != existingRoute.id &&
        route.routePath == updatedRoute.routePath &&
        route.httpMethod == updatedRoute.httpMethod
    );

    if (duplicateIndex !== -1) {
      throw new Error(
        "Route with the same routePath and httpMethod already exists."
      );
    }

    routes[existingRouteIndex] = updatedRoute;
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
