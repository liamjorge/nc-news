const {
  selectArticleComments,
  addArticleComment,
  removeCommentById,
} = require("../models/comments");
const { selectArticleById } = require("../models/articles");

exports.getArticleComments = async (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    selectArticleById(article_id),
    selectArticleComments(article_id),
  ];

  try {
    const [_, comments] = await Promise.all(promises);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const promises = [
    selectArticleById(article_id),
    addArticleComment(article_id, username, body),
  ];

  try {
    const [_, comment] = await Promise.all(promises);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
