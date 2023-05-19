const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
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
    if (!fs.existsSync("data/routes.json")) {
      fs.writeFileSync("data/routes.json", "[]");
      console.log("data/routes.json file created.");
    }

    const routesData = await fs.promises.readFile("data/routes.json", "utf8");
    const parsedRoutes = JSON.parse(routesData);
    routes = convertEnumsToObjects(parsedRoutes);
    return routes;
  } catch (err) {
    console.error("Error reading routes file:", err);
    return [];
  }
};

const saveRoutes = async () => {
  fs.writeFile("data/routes.json", JSON.stringify(routes), "utf8", (err) => {
    if (err) {
      console.error("Error saving routes file:", err);
    }
  });
};

const addRoute = async (newRoute) => {
  console.log(newRoute);
  const newId = uuidv4();
  newRoute = {
    ...newRoute,
    routePath: newRoute.routePath,
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
    throw new Error("not found!");
  }
};

const getById = async (routeId) => {
  const index = routes.find((route) => String(route.id) === routeId);
  if (index !== undefined) {
    return index;
  }
  throw new Error("not found!");
};

module.exports = {
  addRoute,
  saveRoutes,
  deleteRoute,
  updateRoute,
  loadRoutes,
  getById,
};
