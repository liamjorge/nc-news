const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticleById, patchArticleVotes } = require("./controllers/articles");
const app = express();
app.use(express.json());

// topics
app.get("/api/topics", getTopics);

//articles
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid data" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request, missing data" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
});

module.exports = app;
