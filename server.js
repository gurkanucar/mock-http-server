const express = require("express");
const cors = require("cors");
const {
  getUsers,
  getUserById,
  deleteUserById,
} = require("./src/rest/userServiceMock");
const { ResponseType } = require("./src/helper/responseHelper");
const app = express();

const port = 3000;

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ****** REST MOCKS ********** //

app.get("/user", (req, res) => {
  getUsers(req, res, ResponseType.RANDOM_ERROR);
});

app.get("/user/:id", (req, res) => {
  getUserById(req, res);
});

app.post("/user", (req, res) => {
  createNewUser(req, res);
});

app.delete("/user", (req, res) => {
  deleteUserById(req, res);
});
