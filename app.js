const express = require("express");
const { getTopics } = require("./controllers/topics");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles");
const { getUsers } = require("./controllers/users");
const { getArticleComments } = require("./controllers/comments");
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
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

// users
app.get("/api/users", getUsers);

// comments
app.get("/api/articles/:article_id/comments", getArticleComments);

// error handling
app.use("/*", handleRouteNotFound);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
