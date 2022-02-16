const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleID, getAllArticles } = require("./controllers/articles.controller");
const { PSQLerror, handle500s, customError } = require('./error')
const app = express();

// GET REQUESTS
// GET all Topics
app.get('/api/topics', getTopics);  // All
// ARTICLE ENDOINTS
app.get('/api/articles', getAllArticles)    // All
app.get('/api/articles/:article_id', getArticleID);

// ERROR HANDLING
app.use(PSQLerror)
app.use(customError)
app.use(handle500s)

// 404 Handling on all unknown entries
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});

module.exports = app;