// ****** REST MOCKS ********** //

const express = require("express");
const { ResponseType } = require("../../helper/responseHelper");
const {
  getUsers,
  getUserById,
  createNewUser,
  deleteUserById,
} = require("../userServiceMock");

module.exports = (app) => {
  app.get("/user", express.json(), (req, res) => {
    getUsers(req, res, ResponseType.RANDOM_ERROR);
  });

  app.get("/user/:id", express.json(), (req, res) => {
    getUserById(req, res);
  });

  app.post("/user", express.json(), (req, res) => {
    createNewUser(req, res);
  });

  app.delete("/user/:id", express.json(), (req, res) => {
    deleteUserById(req, res);
  });
};
