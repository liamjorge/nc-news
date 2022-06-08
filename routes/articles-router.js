const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("../controllers/articles");
const {
  getArticleComments,
  postArticleComment,
} = require("../controllers/comments");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);

module.exports = articlesRouter;
