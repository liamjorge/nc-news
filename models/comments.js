const db = require("../db/connection");

exports.selectArticleComments = async (article_id) => {
  const queryText = `SELECT * FROM comments
      WHERE article_id=$1`;
  const queryVals = [article_id];
  const comments = await db.query(queryText, queryVals);

  return comments.rows;
};

exports.addArticleComment = async (article_id, username, body) => {
  const queryText = `INSERT INTO comments
  (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *`;
  const queryVals = [article_id, username, body];
  const comment = await db.query(queryText, queryVals);

  return body === ""
    ? Promise.reject({ status: 400, msg: "Comment cannot be empty" })
    : comment.rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const queryText = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  const queryVals = [comment_id];
  const deletedComment = await db.query(queryText, queryVals);

  return deletedComment.rows.length === 0
    ? Promise.reject({ status: 404, msg: "That comment doesn't exist" })
    : null;
};
