const express = require("express");
const {
  loadRoutes,
  addRoute,
  deleteRoute,
  getById,
  updateRoute,
} = require("./routeDB");
const { addResponse, getByRouteId, updateResponse } = require("./responseDB");
const { setupRoutes } = require("./routeGenerator");

module.exports = (app) => {
  app.get("/routes", express.json(), async (req, res) => {
    const routes = await loadRoutes();
    res.json(routes);
  });

  app.post("/routes", express.json(), async (req, res) => {
    const newRoute = req.body;

    const removeProp = "responseData";

    const { [removeProp]: responseData, ...rest } = newRoute;

    const id = await addRoute(rest);
    await addResponse({
      response: newRoute.responseData,
      routeId: id,
    });
    await setupRoutes(app);
    res.sendStatus(200);
  });

  app.delete("/routes/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    await deleteRoute(routeId);
    await setupRoutes(app);
    res.sendStatus(200);
  });

  app.get("/routes/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    try {
      const result = await getById(routeId);
      const responseData = await getByRouteId(routeId);
      result.responseData = responseData;
      res.json(result);
    } catch {
      res.status(404).json({ message: "not found" });
    }
  });

  app.put("/routes/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    try {
      await updateRoute(routeId, req.body);
      await updateResponse({
        response: req.body.responseData,
        routeId: routeId,
      });
      await setupRoutes(app);
      res.status(200).json({ message: "successfully update!" });
    } catch {
      res.status(404).json({ message: "not found" });
    }
  });
};
