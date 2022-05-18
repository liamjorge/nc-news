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
