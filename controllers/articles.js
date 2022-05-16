const { selectArticleById } = require("../models/articles");

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
