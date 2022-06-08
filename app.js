const express = require("express");
const apiRouter = require("./routes/api-router");
const {
  handleRouteNotFound,
  handlePsqlErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errors");

const app = express();
app.use(express.json());

// routes
app.use("/api", apiRouter);

// error handling
app.use("/*", handleRouteNotFound);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
