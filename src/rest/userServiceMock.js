const { removeElementFromArray } = require("../helper/mutateHelper");
const {
  ResponseType,
  handleResponseType,
} = require("../helper/responseHelper");
const { userResponse } = require("./data/userResponse");

exports.getUsers = (req, res, responseType = ResponseType.SUCCESS) => {
  try {
    res.setHeader("Content-Type", "application/json");
    handleResponseType(res, responseType);

    res.send(userResponse);
    // res.json({ "key": "value" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = (req, res, responseType = ResponseType.SUCCESS) => {
  try {
    const userId = req.params.id;
    res.json(userResponse.find((x) => x.id == userId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = (req, res, responseType = ResponseType.SUCCESS) => {
  try {
    const userId = req.params.id;
    removeElementFromArray(review, "id", userId);
    res.json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNewUser = (req, res, responseType = ResponseType.SUCCESS) => {
  try {
    const user = {
      id: userResponse.length + 1,
      username: req.body.username,
    };
    userResponse.push(user);
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
