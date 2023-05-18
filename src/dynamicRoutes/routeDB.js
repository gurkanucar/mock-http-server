const fs = require("fs");
const {
  ApiType,
  ResponseType,
  HttpMethod,
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

const loadRoutes = () => {
  try {
    if (!fs.existsSync("routes.json")) {
      fs.writeFileSync("routes.json", "[]");
      console.log("routes.json file created.");
    }

    const routesData = fs.readFileSync("routes.json", "utf8");
    const parsedRoutes = JSON.parse(routesData);
    routes = convertEnumsToObjects(parsedRoutes);
    return routes;
  } catch (err) {
    console.error("Error reading routes file:", err);
    return [];
  }
};

const saveRoutes = () => {
  fs.writeFile("routes.json", JSON.stringify(routes), "utf8", (err) => {
    if (err) {
      console.error("Error saving routes file:", err);
    }
  });
};

const addRoute = (newRoute) => {
  const lastRoute = routes[routes.length - 1];
  const newId = lastRoute ? lastRoute.id + 1 : 1;
  newRoute.id = newId;
  routes.push(newRoute);
  saveRoutes();
};

const deleteRoute = (routeId) => {
  const index = routes.findIndex((route) => route.id === routeId);
  if (index !== -1) {
    routes.splice(index, 1);
    saveRoutes();
  }
};

const updateRoute = (updatedRoute) => {
  const index = routes.findIndex((route) => route.id === updatedRoute.id);
  if (index !== -1) {
    routes[index] = updatedRoute;
    saveRoutes();
  }
};

module.exports = {
  addRoute,
  deleteRoute,
  updateRoute,
  loadRoutes,
};
