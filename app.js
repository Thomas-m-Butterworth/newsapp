const express = require("express");
const {getTopics} = require("./controllers/topics.controller");
const {getArticleID} = require("./controllers/articles.controller");
const app = express();


// app.listen(9090, () => {
//     console.log(`listening on port 9090`)
// })

// GET REQUESTS
// GET all Topics
app.get('/api/topics', getTopics);
// GET Article ID
app.get('/api/articles/:article_id', getArticleID);


module.exports = app;