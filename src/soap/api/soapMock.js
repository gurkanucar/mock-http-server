const { getSOAPUsers } = require("../service/soapUserServiceMock");

module.exports = (app) => {
  app.get("/soap", (req, res) => {
    res.set("Content-Type", "application/soap+xml");
    getSOAPUsers(req, res);
  });
};
