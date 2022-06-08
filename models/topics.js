const db = require("../db/connection");

exports.selectTopics = async () => {
  const queryText = `SELECT * FROM topics`;
  const topics = await db.query(queryText);

  return topics.rows;
};
