const {selectArticleID} = require("../models/articles.model");

exports.getArticleID = (req, res) => {
    const { article_id } = req.params;
    selectArticleID(article_id).then((article) => {
    res.status(200).send({ article });
    console.log(article)
  });
};