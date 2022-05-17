const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticleById, patchArticleVotes } = require("./controllers/articles");
const {
  handleRouteNotFound,
  handlePsqlErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errors");

const app = express();
app.use(express.json());

// topics
app.get("/api/topics", getTopics);

// articles
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

// error handling
app.use("/*", handleRouteNotFound);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
