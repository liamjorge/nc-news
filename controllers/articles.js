const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
} = require("../models/articles");

exports.getArticles = async (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  try {
    const articles = await selectArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const updatedArticle = await updateArticleVotes(article_id, inc_votes);
    res.status(200).send({ updatedArticle });
  } catch (err) {
    next(err);
  }
};
