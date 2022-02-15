const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleID } = require("./controllers/articles.controller");
const app = express();

// GET REQUESTS
// GET all Topics
app.get('/api/topics', getTopics);
// GET Article ID
app.get('/api/articles/:article_id', getArticleID);

// ERROR HANDLING
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });


// 404 Handling on all unknown entries
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});

module.exports = app;