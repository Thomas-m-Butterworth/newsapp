const db = require("../db/connection");

exports.selectArticleID = (article_id) => {
    return db
      .query(`SELECT * from articles WHERE article_id = $1;`, [article_id])
      .then((result) => result.rows[0])
  };