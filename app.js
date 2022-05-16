const express = require("express");
const { getTopics } = require("./controllers/topics");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
});

module.exports = app;
