const express = require("express");
const cors = require("cors");
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

require("./src/rest/api/restMock")(app);
