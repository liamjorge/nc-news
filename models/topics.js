const db = require("../db/connection");

exports.selectTopics = () => {
  const queryText = `SELECT * FROM topics`;
  return db.query(queryText).then((topics) => topics.rows);
};
