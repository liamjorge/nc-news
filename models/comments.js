const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
  const queryText = `SELECT * FROM comments
      WHERE article_id=$1`;
  const queryVals = [article_id];

  return db
    .query(queryText, queryVals)
    .then((comments) =>
      comments.rows.length === 0
        ? Promise.reject({ status: 204 })
        : comments.rows
    );
};
