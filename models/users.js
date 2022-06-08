const db = require("../db/connection");

exports.selectUsers = async () => {
  const queryText = `SELECT username FROM users`;
  const users = await db.query(queryText);

  return users.rows;
};
