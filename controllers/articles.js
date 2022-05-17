const { selectArticleById, updateArticleVotes } = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc_votes = req.body.inc_votes;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
