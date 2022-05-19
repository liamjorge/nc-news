const db = require("../db/connection");

exports.sortByIsValid = async (sort_by) => {
  const { rows } = await db.query(
    `SELECT ARRAY(SELECT column_name FROM information_schema.columns WHERE table_name = 'articles')`
  );
  return rows[0].array.includes(sort_by.toLowerCase());
};

exports.topicExists = async (topic) => {
  const { rows } = await db.query(`SELECT ARRAY(SELECT slug FROM topics)`);
  return rows[0].array.includes(topic.toLowerCase());
};

exports.topicIsValid = (topic) => {
  const regex = /^\d+$/;
  return !regex.test(topic);
};
