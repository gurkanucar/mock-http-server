require("dotenv").config();

const APP_PREFIX = process.env.APP_PREFIX;

const express = require("express");
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
  try {
    await updateRoute(routeId, updatedRoot);
    await setupRoutes(app);
    res.status(200).json({ message: "successfully update!" });
  } catch (err) {
    res.status(404).json({ message: "not found " + err });
  }
};
