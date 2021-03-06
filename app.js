const cors = require('cors');
const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleID, getAllArticles, patchArticle, getArticleComments, postComment, deleteCommentById} = require("./controllers/articles.controller");
const {getUsers} = require('./controllers/users.controllers')
const { PSQLerror, handle500s, customError } = require('./error')
const { getEndpoints } = require('./controllers/enpoints.controller')
const app = express();

// CORs
app.use(cors())

// Parsing
app.use(express.json());

// GET REQUESTS
// GET all Topics
app.get('/api/topics', getTopics);  // All
// ARTICLE ENDOINTS
app.get('/api/articles', getAllArticles)    // All
app.get('/api/articles/:article_id', getArticleID);
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postComment)
app.delete('/api/comments/:comment_id', deleteCommentById)
app.patch('/api/articles/:article_id', patchArticle);
// GET Users
app.get('/api/users', getUsers)
// GET endpoints
app.get('/api', getEndpoints)

// ERROR HANDLING
app.use(PSQLerror)
app.use(customError)
app.use(handle500s)

// 404 Handling on all unknown entries
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});

module.exports = app;