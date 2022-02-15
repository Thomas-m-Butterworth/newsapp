const db = require("../db/connection");

exports.selectTopics = () => {
    console.log('test function')
  return db
    .query(`SELECT * from topics;`)
    .then((result) => result.rows)
};