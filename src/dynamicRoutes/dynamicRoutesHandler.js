const express = require("express");

const {
  deleteRouteById,
  getPrefix,
  loadRouteData,
  createRoute,
  getRouteDataById,
  updateRouteData,
  saveRabbitAction,
  deleteRabbitAction,
  getRabbitActionSupport,
} = require("./dynamicRoutesService");

module.exports = (app) => {
  app.get("/prefix", express.json(), async (req, res) => {
    getPrefix(req, res, app);
  });

  app.get("/rabbit-action-support", express.json(), async (req, res) => {
    getRabbitActionSupport(req, res, app);
  });


  app.get("/route", express.json(), async (req, res) => {
    loadRouteData(req, res, app);
  });

  app.post("/route", express.json(), async (req, res) => {
    createRoute(req, res, app);
  });

  app.delete("/route/:id", express.json(), async (req, res) => {
    deleteRouteById(req, res, app);
  });

  app.get("/route/:id", express.json(), async (req, res) => {
    getRouteDataById(req, res, app);
  });

  app.put("/route/:id", express.json(), async (req, res) => {
    updateRouteData(req, res, app);
  });

  app.post("/rabbit-action/:id", express.json(), async (req, res) => {
    saveRabbitAction(req, res, app);
  });

  app.delete("/rabbit-action/:id", express.json(), async (req, res) => {
    deleteRabbitAction(req, res, app);
  });
};
