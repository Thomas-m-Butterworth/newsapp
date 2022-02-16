const express = require("express");
const {getTopics} = require("./controllers/topics.controller");
const {getUsers} = require('./controllers/users.controllers')
const app = express();

app.get('/api/topics', getTopics);
app.get('/api/users', getUsers)

module.exports = app;