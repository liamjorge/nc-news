const db = require("../db/connection");

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  let queryVals = [];
  let queryText = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id `;

  const sortByIsValid = async (sort_by) => {
    const { rows } = await db.query(
      `SELECT ARRAY(SELECT column_name FROM information_schema.columns WHERE table_name = 'articles')`
    );
    return rows[0].array.includes(sort_by.toLowerCase());
  };

  const topicExists = async (topic) => {
    const { rows } = await db.query(`SELECT ARRAY(SELECT slug FROM topics)`);
    return rows[0].array.includes(topic.toLowerCase());
  };

  const topicIsValid = (topic) => {
    const regex = /^\d+$/;
    return !regex.test(topic);
  };

  if (topic) {
    if (!topicIsValid(topic)) {
      return Promise.reject({ status: 400, msg: "Invalid topic query" });
    } else if (await topicExists(topic)) {
      queryText += `HAVING articles.topic = $1 `;
      queryVals.push(topic);
    } else {
      return Promise.reject({ status: 404, msg: "That topic doesn't exist" });
    }
  }

  if (await sortByIsValid(sort_by)) {
    queryText += `ORDER BY articles.${sort_by} `;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (["asc", "desc"].includes(order.toLowerCase())) {
    queryText += `${order}`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const { rows } = await db.query(queryText, queryVals);
  return rows;
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
