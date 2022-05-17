const db = require("../db/connection");

exports.selectArticles = () => {
  const queryText = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id`;
  return db.query(queryText).then((articles) => articles.rows);
};

exports.selectArticleById = (article_id) => {
  const queryText = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    HAVING articles.article_id=$1`;
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
