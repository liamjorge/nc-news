const { selectArticleComments } = require("../models/comments");
const { selectArticleById } = require("../models/articles");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [
    selectArticleById(article_id),
    selectArticleComments(article_id),
  ];

  Promise.all(promises)
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
