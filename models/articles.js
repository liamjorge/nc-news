const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const queryText = `SELECT * FROM articles WHERE article_id=$1`;
  const queryVals = [article_id];

  return db.query(queryText, queryVals).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "Bad request, that article doesn't exist",
      });
    } else {
      return article.rows[0];
    }
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryText = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;
  const queryVals = [inc_votes, article_id];

  return db.query(queryText, queryVals).then((updatedArticle) => {
    if (updatedArticle.rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "Bad request, that article doesn't exist",
      });
    }
    return updatedArticle.rows[0];
  });
};
