const db = require("../db/connection");

exports.selectUsers = () => {
  const queryText = `SELECT username FROM users`;
  return db.query(queryText).then((users) => users.rows);
};
