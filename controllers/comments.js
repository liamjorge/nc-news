const {
  selectArticleComments,
  addArticleComment,
} = require("../models/comments");
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

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const promises = [
    selectArticleById(article_id),
    addArticleComment(article_id, username, body),
  ];

  Promise.all(promises)
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};