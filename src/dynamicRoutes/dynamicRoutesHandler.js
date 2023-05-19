const express = require("express");
const {
  loadRoutes,
  addRoute,
  deleteRoute,
  getById,
  updateRoute,
} = require("./routeDB");
const { setupRoutes } = require("./routeGenerator");

module.exports = (app) => {
  app.get("/route", express.json(), async (req, res) => {
    const routes = await loadRoutes();
    res.json(routes);
  });

  app.post("/route", express.json(), async (req, res) => {
    const newRoute = req.body;
    await addRoute(newRoute);
    await setupRoutes(app);
    res.status(201).json({ message: "created" });
  });

  app.delete("/route/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    await deleteRoute(routeId);
    await setupRoutes(app);
    res.sendStatus(200);
  });

  app.get("/route/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    try {
      const result = await getById(routeId);

      res.json(result);
    } catch {
      res.status(404).json({ message: "not found" });
    }
  });

  app.put("/route/:id", express.json(), async (req, res) => {
    const routeId = String(req.params.id);
    const updatedRoot = req.body;
    try {
      await updateRoute(routeId, updatedRoot);
      await setupRoutes(app);
      res.status(200).json({ message: "successfully update!" });
    } catch {
      res.status(404).json({ message: "not found" });
    }
  });
};
