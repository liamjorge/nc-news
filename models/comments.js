const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  const queryText = `SELECT * FROM comments
      WHERE article_id=$1`;
  const queryVals = [article_id];

  return db.query(queryText, queryVals).then((comments) => comments.rows);
};

exports.addArticleComment = (article_id, username, body) => {
  if (body === "") {
    return Promise.reject({ status: 400, msg: "Comment cannot be empty" });
  }

  const queryText = `INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *`;
  const queryVals = [article_id, username, body];

  return db.query(queryText, queryVals).then((comment) => comment.rows[0]);
};

exports.removeCommentById = (comment_id) => {
  const queryText = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  const queryVals = [comment_id];

  return db.query(queryText, queryVals).then((deletedComment) => {
    if (deletedComment.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "That comment doesn't exist" });
    }
  });
};
